import hashlib
from datetime import datetime
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from backend.app.models.all_models import (
    Milestone, Inspection, Finding, EvidenceAsset, Project, BudgetTransaction, AuditLog
)

VALID_TRANSITIONS = {
    "planned": ["in_progress"],
    "in_progress": ["reported"],
    "reported": ["evidence_submitted"],
    "evidence_submitted": ["inspected", "disputed"],
    "inspected": ["verified", "disputed"],
    "verified": [],  # Terminal state (immutable)
    "disputed": ["in_progress", "inspected"]
}

async def advance_milestone_status(
    session: AsyncSession,
    milestone_id: str,
    target_status: str,
    actor_id: str,
    actor_name: str,
    actor_role: str
) -> Milestone:
    """Enforces strict state machine transitions for construction milestones."""
    stmt = select(Milestone).where(Milestone.id == milestone_id)
    result = await session.execute(stmt)
    milestone = result.scalar_one_or_none()

    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Milestone {milestone_id} not found"
        )

    current_status = milestone.status.lower()
    allowed_targets = VALID_TRANSITIONS.get(current_status, [])

    if target_status not in allowed_targets:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Invalid trust progression: cannot transition milestone from "
                f"'{current_status}' to '{target_status}'. "
                f"Valid transitions from '{current_status}': {allowed_targets}"
            )
        )

    # Role enforcement
    if target_status in ["reported", "evidence_submitted"] and actor_role not in ["contractor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only contractor or admin can submit work updates and evidence"
        )

    if target_status == "inspected" and actor_role not in ["inspector", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only licensed independent inspector or admin can record inspection completion"
        )

    if target_status == "verified" and actor_role not in ["admin", "customer", "inspector"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or customer can sign off on independent milestone verification"
        )

    prev_state = {"status": milestone.status}
    milestone.status = target_status

    # Record audit log
    audit_log = AuditLog(
        project_id=milestone.project_id,
        actor_id=actor_id,
        actor_name=actor_name,
        action=f"milestone_transition_to_{target_status}",
        entity_type="milestone",
        entity_id=milestone.id,
        prev_state_json=prev_state,
        new_state_json={"status": target_status}
    )
    session.add(audit_log)
    await session.commit()
    await session.refresh(milestone)
    return milestone

async def verify_milestone_and_release_escrow(
    session: AsyncSession,
    milestone_id: str,
    verified_by: str,
    actor_id: str,
    actor_role: str,
    notes: Optional[str] = None
) -> Tuple[Milestone, Optional[BudgetTransaction]]:
    """Cryptographically seals independent verification and executes conditional escrow disbursement."""
    # Enforce authorized actor role
    if actor_role not in ["admin", "inspector"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Actor role '{actor_role}' is not authorized to verify milestones. Only independent civil inspectors or platform administrators can authorize verification and escrow release."
        )

    # Find milestone with project and inspections
    stmt = select(Milestone).where(Milestone.id == milestone_id)
    result = await session.execute(stmt)
    milestone = result.scalar_one_or_none()

    if not milestone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found")

    if milestone.status == "verified":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Milestone is already independently verified")

    # Fetch inspections for this milestone
    insp_stmt = select(Inspection).where(Inspection.milestone_id == milestone_id)
    insp_res = await session.execute(insp_stmt)
    inspections = insp_res.scalars().all()

    if not inspections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot verify milestone: no independent site inspections on record"
        )

    # Check that at least one inspection has passed and no unresolved critical findings exist
    passed_inspections = [i for i in inspections if i.overall_status == "passed"]
    if not passed_inspections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot verify milestone: independent inspection status is not passed"
        )

    latest_insp = passed_inspections[-1]

    # Check unresolved critical findings
    find_stmt = select(Finding).where(
        Finding.milestone_id == milestone_id,
        Finding.severity.in_(["high", "critical"]),
        Finding.resolution_status != "verified_resolved"
    )
    find_res = await session.execute(find_stmt)
    open_critical_findings = find_res.scalars().all()

    if open_critical_findings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot verify milestone: {len(open_critical_findings)} high/critical findings remain open"
        )

    # Compute cryptographic verification signature
    now = datetime.utcnow()
    raw_hash_input = f"{milestone.project_id}:{milestone.id}:{latest_insp.id}:{latest_insp.inspector_license}:{now.isoformat()}"
    verification_hash = hashlib.sha256(raw_hash_input.encode("utf-8")).hexdigest()

    # Update milestone
    milestone.status = "verified"
    milestone.verification_hash = verification_hash
    milestone.verified_at = now
    milestone.verified_by = verified_by
    milestone.completed_date = now.strftime("%Y-%m-%d")

    # Update project financials & progress
    proj_stmt = select(Project).where(Project.id == milestone.project_id)
    proj_res = await session.execute(proj_stmt)
    project = proj_res.scalar_one_or_none()

    transaction = None
    if project:
        disbursement_amount = milestone.escrow_amount

        # Check if a disbursement transaction for this milestone already exists to prevent duplicates
        existing_tx_stmt = select(BudgetTransaction).where(
            BudgetTransaction.milestone_id == milestone.id,
            BudgetTransaction.transaction_type == "contractor_disbursement",
            BudgetTransaction.status == "cleared"
        )
        existing_tx_res = await session.execute(existing_tx_stmt)
        existing_tx = existing_tx_res.scalar_one_or_none()

        if existing_tx:
            transaction = existing_tx
        else:
            project.spent_amount += disbursement_amount
            project.escrow_balance = max(0.0, project.escrow_balance - disbursement_amount)

            # Create BudgetTransaction record for disbursement
            transaction = BudgetTransaction(
                project_id=project.id,
                milestone_id=milestone.id,
                title=f"Stage {milestone.stage_number} Milestone Verified Release - {milestone.title}",
                category="Verified Milestone Disbursement",
                amount=disbursement_amount,
                transaction_type="contractor_disbursement",
                date=now.strftime("%Y-%m-%d"),
                status="cleared",
                invoice_url=f"/invoices/disbursement-{milestone.id[:8]}.pdf"
            )
            session.add(transaction)

        # Calculate new verified percentage
        all_m_stmt = select(Milestone).where(Milestone.project_id == project.id)
        all_m_res = await session.execute(all_m_stmt)
        all_milestones = all_m_res.scalars().all()
        total_p = sum(m.payment_percentage for m in all_milestones)
        verified_p = sum(m.payment_percentage for m in all_milestones if m.status == "verified" or m.id == milestone.id)
        if total_p > 0:
            project.verified_percentage = int((verified_p / total_p) * 100)

    # Add audit log
    audit_log = AuditLog(
        project_id=milestone.project_id,
        actor_id=actor_id,
        actor_name=verified_by,
        action="milestone_independently_verified",
        entity_type="milestone",
        entity_id=milestone.id,
        prev_state_json={"status": "inspected"},
        new_state_json={"status": "verified", "hash": verification_hash, "disbursed": milestone.escrow_amount}
    )
    session.add(audit_log)

    await session.commit()
    await session.refresh(milestone)
    return milestone, transaction
