from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.all_models import (
    BudgetTransaction, Project, Milestone, User, ProjectMembership
)
from backend.app.schemas.schemas import (
    BudgetTransactionResponse, BudgetTransactionCreate, BudgetSummaryResponse
)
from backend.app.api.deps import get_current_user, verify_project_access

router = APIRouter(prefix="/financials", tags=["Financials & Escrow"])

@router.get("/summary", response_model=BudgetSummaryResponse)
async def get_budget_summary(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculates live financial balances and escrow allocations from persisted records."""
    if project_id:
        p_stmt = select(Project).where(Project.id == project_id)
    else:
        # If no project_id specified, find active project accessible to current_user
        p_stmt = select(Project)
        if current_user.role != "admin":
            p_stmt = p_stmt.join(
                ProjectMembership,
                (ProjectMembership.project_id == Project.id) & (ProjectMembership.user_id == current_user.id)
            )
        p_stmt = p_stmt.limit(1)

    p_res = await db.execute(p_stmt)
    project = p_res.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="No authorized active project found")

    await verify_project_access(project.id, current_user, db)

    t_stmt = (
        select(BudgetTransaction)
        .where(BudgetTransaction.project_id == project.id)
        .order_by(BudgetTransaction.date.desc())
    )
    t_res = await db.execute(t_stmt)
    transactions = t_res.scalars().all()

    total_budget = project.total_budget
    spent_amount = project.spent_amount
    escrow_balance = project.escrow_balance
    remaining_budget = max(0.0, total_budget - spent_amount)

    verified_released = sum(
        t.amount for t in transactions
        if t.transaction_type == "contractor_disbursement" and t.status == "cleared"
    )
    retention_held = total_budget * 0.05  # Standard 5% structural defect retention

    # Calculate live value of funds under inspection from persisted milestone states
    m_stmt = select(Milestone).where(
        Milestone.project_id == project.id,
        Milestone.status.in_(["reported", "evidence_submitted", "inspected"])
    )
    m_res = await db.execute(m_stmt)
    under_insp_milestones = m_res.scalars().all()
    under_inspection = float(sum(m.escrow_amount for m in under_insp_milestones))

    return BudgetSummaryResponse(
        total_budget=total_budget,
        spent_amount=spent_amount,
        escrow_balance=escrow_balance,
        remaining_budget=remaining_budget,
        verified_released=verified_released,
        under_inspection=under_inspection,
        retention_held=retention_held,
        recent_transactions=transactions
    )

@router.get("/transactions", response_model=List[BudgetTransactionResponse])
async def list_transactions(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves all project financial transactions with access control."""
    stmt = select(BudgetTransaction).order_by(BudgetTransaction.date.desc())
    if project_id:
        await verify_project_access(project_id, current_user, db)
        stmt = stmt.where(BudgetTransaction.project_id == project_id)
    elif current_user.role != "admin":
        stmt = stmt.join(
            ProjectMembership,
            (ProjectMembership.project_id == BudgetTransaction.project_id) & (ProjectMembership.user_id == current_user.id)
        )

    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/transactions", response_model=BudgetTransactionResponse)
async def create_transaction(
    req: BudgetTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a new financial transaction record. Requires administrator permissions."""
    await verify_project_access(req.project_id, current_user, db, allowed_roles=["admin"])

    tx = BudgetTransaction(
        project_id=req.project_id,
        milestone_id=req.milestone_id,
        title=req.title,
        category=req.category,
        amount=req.amount,
        transaction_type=req.transaction_type,
        date=req.date,
        status=req.status
    )
    db.add(tx)
    await db.commit()
    await db.refresh(tx)
    return tx
