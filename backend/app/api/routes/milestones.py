from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.all_models import (
    Milestone, WorkUpdate, EvidenceAsset, User
)
from backend.app.schemas.schemas import (
    MilestoneResponse, WorkUpdateCreate, WorkUpdateResponse,
    EvidenceAssetCreate, EvidenceAssetResponse, MilestoneVerificationRequest
)
from backend.app.api.deps import get_current_user, verify_project_access
from backend.app.services.verification_service import (
    advance_milestone_status, verify_milestone_and_release_escrow
)

router = APIRouter(prefix="/milestones", tags=["Milestones & Verification"])

@router.get("", response_model=List[MilestoneResponse])
async def list_milestones(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists milestones with associated updates, evidence, and inspection records."""
    if project_id:
        await verify_project_access(project_id, current_user, db)

    stmt = (
        select(Milestone)
        .options(
            selectinload(Milestone.work_updates).selectinload(WorkUpdate.evidence_assets),
            selectinload(Milestone.evidence_assets),
            selectinload(Milestone.inspections)
        )
        .order_by(Milestone.order_index)
    )
    if project_id:
        stmt = stmt.where(Milestone.project_id == project_id)

    result = await db.execute(stmt)
    milestones = result.scalars().all()
    return milestones

@router.get("/{milestone_id}", response_model=MilestoneResponse)
async def get_milestone(
    milestone_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves full detail for a single milestone with access control."""
    stmt = (
        select(Milestone)
        .where(Milestone.id == milestone_id)
        .options(
            selectinload(Milestone.work_updates).selectinload(WorkUpdate.evidence_assets),
            selectinload(Milestone.evidence_assets),
            selectinload(Milestone.inspections)
        )
    )
    result = await db.execute(stmt)
    milestone = result.scalar_one_or_none()

    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    await verify_project_access(milestone.project_id, current_user, db)
    return milestone

async def _process_work_update(
    milestone_id: str,
    req: WorkUpdateCreate,
    db: AsyncSession,
    current_user: User
) -> WorkUpdate:
    stmt = select(Milestone).where(Milestone.id == milestone_id)
    res = await db.execute(stmt)
    milestone = res.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Verify user has contractor or admin permission on this project
    await verify_project_access(milestone.project_id, current_user, db, allowed_roles=["contractor", "admin"])

    progress_val = req.progress_percent if req.progress_percent is not None else 0.0
    notes_val = req.contractor_notes or req.notes or ""
    summary_val = req.summary or req.notes or f"Progress reported at {progress_val:.0f}%"
    title_val = req.title or f"Progress Update ({progress_val:.0f}%)"
    work_val = req.work_performed or req.notes or f"Contractor recorded {progress_val:.0f}% milestone progress"

    work_update = WorkUpdate(
        milestone_id=milestone_id,
        title=title_val,
        summary=summary_val,
        work_performed=work_val,
        materials_used=req.materials_used,
        contractor_notes=notes_val,
        progress_percent=progress_val,
        created_by=current_user.full_name
    )
    db.add(work_update)
    await db.flush()

    # If photo metadata was provided with the work update, persist as unverified EvidenceAsset
    if req.photo_url:
        evidence = EvidenceAsset(
            milestone_id=milestone_id,
            work_update_id=work_update.id,
            title=req.photo_title or "Site Progress Photo",
            file_url=req.photo_url,
            file_type="image/jpeg",
            file_size_bytes=1048576,
            uploader_id=current_user.id,
            verification_status="unverified"  # CRITICAL: strictly unverified until certified inspection
        )
        db.add(evidence)

    # Progress milestone status to 'reported' if in progress
    if milestone.status == "in_progress":
        milestone.status = "reported"

    await db.commit()
    await db.refresh(work_update)
    return work_update

@router.post("/{milestone_id}/work-updates", response_model=WorkUpdateResponse)
async def add_work_update(
    milestone_id: str,
    req: WorkUpdateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Contractor submits a progress report for a milestone."""
    return await _process_work_update(milestone_id, req, db, current_user)

@router.post("/{milestone_id}/progress", response_model=WorkUpdateResponse)
async def submit_progress(
    milestone_id: str,
    req: WorkUpdateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Unified client contract: Submit milestone progress update with optional evidence metadata."""
    return await _process_work_update(milestone_id, req, db, current_user)

@router.post("/{milestone_id}/evidence", response_model=EvidenceAssetResponse)
async def add_evidence_asset(
    milestone_id: str,
    req: EvidenceAssetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Uploads photographic or laboratory test evidence.
    CRITICAL: Uploaded evidence starts as 'unverified' and does NOT automatically verify a milestone!"""
    stmt = select(Milestone).where(Milestone.id == milestone_id)
    res = await db.execute(stmt)
    milestone = res.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    await verify_project_access(milestone.project_id, current_user, db, allowed_roles=["contractor", "admin"])

    evidence = EvidenceAsset(
        milestone_id=milestone_id,
        work_update_id=req.work_update_id,
        title=req.title,
        file_url=req.file_url,
        file_type=req.file_type,
        file_size_bytes=req.file_size_bytes,
        sha256_hash=req.sha256_hash,
        uploader_id=current_user.id,
        verification_status="unverified"  # Explicitly unverified until independent inspection
    )
    db.add(evidence)

    # Progress milestone status to evidence_submitted if it was reported
    if milestone.status == "reported":
        milestone.status = "evidence_submitted"

    await db.commit()
    await db.refresh(evidence)
    return evidence

@router.post("/{milestone_id}/verify", response_model=MilestoneResponse)
async def verify_milestone(
    milestone_id: str,
    req: MilestoneVerificationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cryptographically verifies a milestone after independent site inspection and releases escrow."""
    stmt = select(Milestone).where(Milestone.id == milestone_id)
    res = await db.execute(stmt)
    milestone = res.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Only licensed civil inspectors or platform administrators can verify
    await verify_project_access(milestone.project_id, current_user, db, allowed_roles=["inspector", "admin"])

    verification_notes = req.verification_notes or req.notes or "Independently verified by engineering auditor"

    milestone, _ = await verify_milestone_and_release_escrow(
        session=db,
        milestone_id=milestone_id,
        verified_by=req.verified_by,
        actor_id=current_user.id,
        actor_role=current_user.role,
        notes=verification_notes
    )

    # Fetch fresh milestone with relationships loaded
    fresh_stmt = (
        select(Milestone)
        .where(Milestone.id == milestone_id)
        .options(
            selectinload(Milestone.work_updates).selectinload(WorkUpdate.evidence_assets),
            selectinload(Milestone.evidence_assets),
            selectinload(Milestone.inspections)
        )
    )
    res_fresh = await db.execute(fresh_stmt)
    return res_fresh.scalar_one()
