"""
Enhanced analytics route providing real data-backed chart datasets from the database.
Uses only data that is actually persisted — no fabricated ML predictions or fake scores.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.app.database import get_db
from backend.app.models.all_models import (
    Project, Inspection, Milestone, BudgetTransaction, Dispute,
    ContractorProfile, User, Finding, EvidenceAsset, WorkUpdate
)
from backend.app.schemas.schemas import AnalyticsSummaryResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics & Chart Metrics"])


@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculates operational and trust metrics from persisted database records."""
    # Count projects
    p_stmt = select(func.count(Project.id))
    p_res = await db.execute(p_stmt)
    total_projects = p_res.scalar() or 0

    # Count active projects
    active_stmt = select(func.count(Project.id)).where(Project.status == "active")
    active_res = await db.execute(active_stmt)
    active_projects = active_res.scalar() or 0

    # Count verified inspections
    insp_stmt = select(func.count(Inspection.id)).where(Inspection.overall_status == "passed")
    insp_res = await db.execute(insp_stmt)
    verified_inspections = insp_res.scalar() or 0

    # Total budget secured (all projects)
    escrow_stmt = select(func.sum(Project.total_budget))
    escrow_res = await db.execute(escrow_stmt)
    total_escrow = escrow_res.scalar() or 0.0

    # Total actually disbursed (cleared contractor disbursements)
    disb_stmt = select(func.sum(BudgetTransaction.amount)).where(
        BudgetTransaction.transaction_type == "contractor_disbursement",
        BudgetTransaction.status == "cleared"
    )
    disb_res = await db.execute(disb_stmt)
    total_disbursed = disb_res.scalar() or 0.0

    # Open disputes
    disp_stmt = select(func.count(Dispute.id)).where(Dispute.status == "open")
    disp_res = await db.execute(disp_stmt)
    open_disputes = disp_res.scalar() or 0

    # Average contractor trust score (from real contractor profiles)
    trust_stmt = select(func.avg(ContractorProfile.trust_score))
    trust_res = await db.execute(trust_stmt)
    avg_trust_raw = trust_res.scalar()
    avg_trust = float(avg_trust_raw) if avg_trust_raw is not None else 0.0

    return AnalyticsSummaryResponse(
        total_projects=total_projects,
        active_projects=active_projects,
        verified_inspections=verified_inspections,
        total_escrow_secured=float(total_escrow),
        total_disbursed=float(total_disbursed),
        open_disputes=open_disputes,
        average_trust_score=round(avg_trust, 1),
        # NOTE: safety_compliance_rate is not yet calculated from real data.
        # A real implementation would require a dedicated compliance tracking model.
        safety_compliance_rate=None
    )


@router.get("/progress-chart")
async def get_progress_chart_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns milestone progress data from the database.
    Returns three series: planned (contractual), contractor-reported, independently verified.
    NOTE: Contractor-reported progress is inferred from work_updates presence (not a separate field).
    """
    m_stmt = select(Milestone).order_by(Milestone.order_index)
    m_res = await db.execute(m_stmt)
    milestones = m_res.scalars().all()

    if not milestones:
        return {
            "data_available": False,
            "message": "No milestone data recorded yet.",
            "milestones": []
        }

    rows = []
    for m in milestones:
        # Planned: always 100 if it should be complete by now, else 0 (simplified binary)
        planned = 100 if m.status in ("verified", "inspected", "evidence_submitted", "reported") else 0

        # Contractor reported: exists if status >= "reported"
        contractor_reported = 100 if m.status in ("verified", "inspected", "evidence_submitted", "reported") else (
            50 if m.status == "in_progress" else 0
        )

        # Independently verified: only when milestone status is "verified"
        independently_verified = 100 if m.status == "verified" else 0

        rows.append({
            "stage_number": m.stage_number,
            "title": m.title,
            "status": m.status,
            "planned_pct": planned,
            "contractor_reported_pct": contractor_reported,
            "verified_pct": independently_verified,
            "payment_percentage": m.payment_percentage,
            "target_date": m.target_date,
            "completed_date": m.completed_date,
            "verified_by": m.verified_by,
        })

    return {
        "data_available": True,
        "milestones": rows
    }


@router.get("/budget-chart")
async def get_budget_chart_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns budget allocation and actual spending from recorded transactions.
    NOTE: amounts are in INR. No fabricated projections are included.
    """
    # Get first project (single project system)
    proj_stmt = select(Project).limit(1)
    proj_res = await db.execute(proj_stmt)
    project = proj_res.scalar_one_or_none()

    if not project:
        return {"data_available": False, "message": "No project found."}

    # Category-level spending from actual transactions
    cat_stmt = select(
        BudgetTransaction.category,
        func.sum(BudgetTransaction.amount).label("total"),
        func.count(BudgetTransaction.id).label("count")
    ).where(
        BudgetTransaction.project_id == project.id,
        BudgetTransaction.status == "cleared"
    ).group_by(BudgetTransaction.category)
    cat_res = await db.execute(cat_stmt)
    category_rows = cat_res.all()

    category_spend = [
        {"category": row.category, "amount": float(row.total), "count": row.count}
        for row in category_rows
    ]

    # Milestone allocation breakdown
    ms_stmt = select(Milestone).where(Milestone.project_id == project.id).order_by(Milestone.order_index)
    ms_res = await db.execute(ms_stmt)
    milestones = ms_res.scalars().all()

    milestone_allocation = [
        {
            "title": m.title,
            "stage_number": m.stage_number,
            "escrow_amount": m.escrow_amount,
            "payment_percentage": m.payment_percentage,
            "status": m.status,
        }
        for m in milestones
    ]

    # Chronological cleared transactions (for burn timeline)
    tx_stmt = select(BudgetTransaction).where(
        BudgetTransaction.project_id == project.id,
        BudgetTransaction.status == "cleared"
    ).order_by(BudgetTransaction.date)
    tx_res = await db.execute(tx_stmt)
    transactions = tx_res.scalars().all()

    burn_timeline = [
        {"date": tx.date, "title": tx.title, "amount": tx.amount, "category": tx.category}
        for tx in transactions
    ]

    return {
        "data_available": True,
        "project_id": project.id,
        "total_budget": project.total_budget,
        "spent_amount": project.spent_amount,
        "escrow_balance": project.escrow_balance,
        "remaining_unallocated": max(0.0, project.total_budget - project.spent_amount - project.escrow_balance),
        "category_spend": category_spend,
        "milestone_allocation": milestone_allocation,
        "burn_timeline": burn_timeline,
    }


@router.get("/issues-chart")
async def get_issues_chart_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns finding/issue breakdown from recorded inspections.
    Grouped by severity, category and resolution status.
    """
    # All findings from DB
    f_stmt = select(Finding)
    f_res = await db.execute(f_stmt)
    findings = f_res.scalars().all()

    if not findings:
        return {
            "data_available": False,
            "message": "No findings recorded from inspections yet.",
            "findings": []
        }

    # Severity breakdown
    severity_counts: Dict[str, int] = {}
    status_counts: Dict[str, int] = {}
    category_counts: Dict[str, int] = {}

    for f in findings:
        severity_counts[f.severity] = severity_counts.get(f.severity, 0) + 1
        status_counts[f.resolution_status] = status_counts.get(f.resolution_status, 0) + 1
        category_counts[f.category] = category_counts.get(f.category, 0) + 1

    return {
        "data_available": True,
        "total": len(findings),
        "severity_breakdown": [
            {"severity": k, "count": v} for k, v in sorted(severity_counts.items())
        ],
        "status_breakdown": [
            {"status": k, "count": v} for k, v in sorted(status_counts.items())
        ],
        "category_breakdown": [
            {"category": k, "count": v}
            for k, v in sorted(category_counts.items(), key=lambda x: -x[1])
        ],
        "findings": [
            {
                "id": f.id,
                "title": f.title,
                "severity": f.severity,
                "category": f.category,
                "resolution_status": f.resolution_status,
                "location": f.location_on_site,
            }
            for f in findings
        ]
    }


@router.get("/inspection-status")
async def get_inspection_status_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns inspection timeline and status summary from recorded inspections.
    """
    i_stmt = select(Inspection).order_by(Inspection.inspection_date)
    i_res = await db.execute(i_stmt)
    inspections = i_res.scalars().all()

    if not inspections:
        return {
            "data_available": False,
            "message": "No inspections recorded yet.",
            "inspections": []
        }

    status_counts: Dict[str, int] = {}
    for insp in inspections:
        status_counts[insp.overall_status] = status_counts.get(insp.overall_status, 0) + 1

    return {
        "data_available": True,
        "total": len(inspections),
        "status_breakdown": [
            {"status": k, "count": v} for k, v in sorted(status_counts.items())
        ],
        "inspections": [
            {
                "id": insp.id,
                "inspector_name": insp.inspector_name,
                "inspection_date": insp.inspection_date,
                "overall_status": insp.overall_status,
                "notes": insp.notes,
                "milestone_id": insp.milestone_id,
            }
            for insp in inspections
        ]
    }


@router.get("/chart-data")
async def get_chart_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Combined chart data endpoint for frontend dashboards.
    Returns only data that exists in the database — no fabricated records.
    NOTE: monthly_burn_rate shows only cleared transactions grouped by month.
    """
    m_stmt = select(Milestone).order_by(Milestone.order_index)
    m_res = await db.execute(m_stmt)
    milestones = m_res.scalars().all()

    labels = [f"Stage {m.stage_number}: {m.title[:20]}..." if len(m.title) > 20 else f"Stage {m.stage_number}: {m.title}" for m in milestones]
    planned_shares = [m.payment_percentage for m in milestones]
    verified_shares = [m.payment_percentage if m.status == "verified" else 0 for m in milestones]
    reported_shares = [
        m.payment_percentage if m.status in ("verified", "inspected", "evidence_submitted", "reported") else 0
        for m in milestones
    ]

    # Category spend distribution from real transactions
    t_stmt = select(
        BudgetTransaction.category,
        func.sum(BudgetTransaction.amount)
    ).where(BudgetTransaction.status == "cleared").group_by(BudgetTransaction.category)
    t_res = await db.execute(t_stmt)
    category_spend = [{"category": row[0], "amount": float(row[1])} for row in t_res.all()]

    # Monthly burn from real cleared transactions (grouped by YYYY-MM)
    tx_stmt = select(BudgetTransaction).where(BudgetTransaction.status == "cleared").order_by(BudgetTransaction.date)
    tx_res = await db.execute(tx_stmt)
    txs = tx_res.scalars().all()

    monthly_burn: Dict[str, float] = {}
    for tx in txs:
        try:
            month_key = tx.date[:7]  # "YYYY-MM"
            monthly_burn[month_key] = monthly_burn.get(month_key, 0.0) + tx.amount
        except Exception:
            pass

    monthly_burn_list = [
        {"month": k, "amount": v}
        for k, v in sorted(monthly_burn.items())
    ]

    return {
        "data_source": "database",
        "milestones_progress": {
            "labels": labels,
            "planned_percentages": planned_shares,
            "verified_percentages": verified_shares,
            "contractor_reported_percentages": reported_shares,
        },
        "budget_distribution": category_spend,
        "monthly_burn_rate": monthly_burn_list,
        "insufficient_data": len(monthly_burn_list) < 2
    }
