from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
from backend.app.database import get_db
from backend.app.models.all_models import Dispute, User, ProjectMembership
from backend.app.schemas.schemas import DisputeResponse, DisputeCreate, DisputeUpdate
from backend.app.api.deps import get_current_user, verify_project_access

router = APIRouter(prefix="/disputes", tags=["Dispute Mediation"])

@router.get("", response_model=List[DisputeResponse])
async def list_disputes(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves all active or resolved disputes with access control."""
    stmt = select(Dispute).order_by(Dispute.created_at.desc())
    if project_id:
        await verify_project_access(project_id, current_user, db)
        stmt = stmt.where(Dispute.project_id == project_id)
    elif current_user.role != "admin":
        stmt = stmt.join(
            ProjectMembership,
            (ProjectMembership.project_id == Dispute.project_id) & (ProjectMembership.user_id == current_user.id)
        )

    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=DisputeResponse)
async def create_dispute(
    req: DisputeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Files a formal construction dispute pausing affected escrow releases."""
    await verify_project_access(req.project_id, current_user, db, allowed_roles=["customer", "contractor", "admin"])

    dispute = Dispute(
        project_id=req.project_id,
        milestone_id=req.milestone_id,
        title=req.title,
        raised_by=req.raised_by or current_user.full_name,
        reason=req.reason,
        status="open"
    )
    db.add(dispute)
    await db.commit()
    await db.refresh(dispute)
    return dispute

@router.patch("/{dispute_id}", response_model=DisputeResponse)
async def update_dispute(
    dispute_id: str,
    req: DisputeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates mediation state or resolution outcome. Requires admin mediator role."""
    stmt = select(Dispute).where(Dispute.id == dispute_id)
    res = await db.execute(stmt)
    dispute = res.scalar_one_or_none()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    await verify_project_access(dispute.project_id, current_user, db, allowed_roles=["admin"])

    dispute.status = req.status
    if req.resolution_summary:
        dispute.resolution_summary = req.resolution_summary
    if req.status == "resolved":
        dispute.resolved_at = datetime.utcnow()

    await db.commit()
    await db.refresh(dispute)
    return dispute
