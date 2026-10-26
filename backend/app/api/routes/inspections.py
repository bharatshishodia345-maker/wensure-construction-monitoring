from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.database import get_db
from backend.app.models.all_models import (
    Inspection, Finding, Milestone, User
)
from backend.app.schemas.schemas import (
    InspectionResponse, InspectionCreate, FindingResponse, FindingRespondRequest
)
from backend.app.api.deps import get_current_user, verify_project_access

router = APIRouter(prefix="/inspections", tags=["Independent Inspections"])

class FindingStatusUpdate(BaseModel):
    resolution_status: str  # open, addressed, verified_resolved

@router.get("", response_model=List[InspectionResponse])
async def list_inspections(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves all third-party engineering inspections with their structural findings."""
    if project_id:
        await verify_project_access(project_id, current_user, db)

    stmt = (
        select(Inspection)
        .options(selectinload(Inspection.findings))
        .order_by(Inspection.created_at.desc())
    )
    if project_id:
        stmt = stmt.where(Inspection.project_id == project_id)

    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{inspection_id}", response_model=InspectionResponse)
async def get_inspection(
    inspection_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves a single inspection report with authorization check."""
    stmt = (
        select(Inspection)
        .where(Inspection.id == inspection_id)
        .options(selectinload(Inspection.findings))
    )
    result = await db.execute(stmt)
    insp = result.scalar_one_or_none()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection report not found")

    await verify_project_access(insp.project_id, current_user, db)
    return insp

@router.post("", response_model=InspectionResponse)
async def create_inspection(
    req: InspectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Licensed civil engineer records an independent physical site inspection."""
    await verify_project_access(req.project_id, current_user, db, allowed_roles=["inspector", "admin"])

    m_stmt = select(Milestone).where(Milestone.id == req.milestone_id)
    m_res = await db.execute(m_stmt)
    milestone = m_res.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail=f"Milestone '{req.milestone_id}' not found")

    insp = Inspection(
        project_id=req.project_id,
        milestone_id=req.milestone_id,
        inspector_name=req.inspector_name,
        inspector_license=req.inspector_license,
        inspection_date=req.inspection_date,
        overall_status=req.overall_status,
        notes=req.notes,
        report_pdf_url=req.report_pdf_url
    )
    db.add(insp)
    await db.flush()

    for f in req.findings:
        finding = Finding(
            inspection_id=insp.id,
            milestone_id=req.milestone_id,
            category=f.category,
            severity=f.severity,
            title=f.title,
            description=f.description,
            location_on_site=f.location_on_site,
            resolution_status="open"
        )
        db.add(finding)

    # Update milestone status to inspected if passed
    if milestone.status in ["evidence_submitted", "reported"]:
        milestone.status = "inspected"

    await db.commit()
    await db.refresh(insp)

    stmt = select(Inspection).where(Inspection.id == insp.id).options(selectinload(Inspection.findings))
    fresh = await db.execute(stmt)
    return fresh.scalar_one()

@router.post("/findings/{finding_id}/respond", response_model=FindingResponse)
async def respond_to_finding(
    finding_id: str,
    req: FindingRespondRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Contractor submits a formal rectification response and plan for an identified finding."""
    stmt = (
        select(Finding)
        .where(Finding.id == finding_id)
        .options(selectinload(Finding.milestone), selectinload(Finding.inspection))
    )
    result = await db.execute(stmt)
    finding = result.scalar_one_or_none()

    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    project_id = finding.milestone.project_id if finding.milestone else (finding.inspection.project_id if finding.inspection else None)
    if not project_id:
        raise HTTPException(status_code=400, detail="Finding has no associated project record")

    # Only contractor or admin can submit rectification response
    await verify_project_access(project_id, current_user, db, allowed_roles=["contractor", "admin"])

    finding.contractor_response = req.contractor_response
    finding.rectification_plan = req.rectification_plan
    finding.contractor_response_date = datetime.utcnow()
    finding.resolution_status = "addressed"

    await db.commit()
    await db.refresh(finding)
    return finding

@router.post("/findings/{finding_id}/resolve", response_model=FindingResponse)
async def resolve_finding(
    finding_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Licensed civil inspector or admin verifies and closes a rectified finding."""
    stmt = (
        select(Finding)
        .where(Finding.id == finding_id)
        .options(selectinload(Finding.milestone), selectinload(Finding.inspection))
    )
    result = await db.execute(stmt)
    finding = result.scalar_one_or_none()

    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    # CRITICAL WENSURE TRUST RULE: Contractors CANNOT resolve their own findings!
    if current_user.role == "contractor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Contractors cannot self-verify defect resolution. Only licensed civil inspectors or platform administrators can verify and resolve findings."
        )

    project_id = finding.milestone.project_id if finding.milestone else (finding.inspection.project_id if finding.inspection else None)
    if not project_id:
        raise HTTPException(status_code=400, detail="Finding has no associated project record")

    await verify_project_access(project_id, current_user, db, allowed_roles=["inspector", "admin"])

    finding.resolution_status = "verified_resolved"
    finding.resolved_at = datetime.utcnow()

    await db.commit()
    await db.refresh(finding)
    return finding

@router.patch("/findings/{finding_id}", response_model=FindingResponse)
async def update_finding_status(
    finding_id: str,
    req: FindingStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates defect resolution status with role checks."""
    stmt = (
        select(Finding)
        .where(Finding.id == finding_id)
        .options(selectinload(Finding.milestone))
    )
    result = await db.execute(stmt)
    finding = result.scalar_one_or_none()

    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    if req.resolution_status == "verified_resolved":
        if current_user.role == "contractor":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Contractors cannot self-verify finding resolution"
            )
        await verify_project_access(finding.milestone.project_id, current_user, db, allowed_roles=["inspector", "admin"])
        finding.resolved_at = datetime.utcnow()
    else:
        await verify_project_access(finding.milestone.project_id, current_user, db, allowed_roles=["contractor", "admin"])

    finding.resolution_status = req.resolution_status
    await db.commit()
    await db.refresh(finding)
    return finding
