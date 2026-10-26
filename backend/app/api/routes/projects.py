from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.all_models import Project, Milestone, User, ProjectMembership
from backend.app.schemas.schemas import ProjectResponse, ProjectCreate, ProjectUpdate
from backend.app.api.deps import get_current_user, get_optional_current_user, verify_project_access

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves all projects accessible to the authenticated user based on membership."""
    stmt = (
        select(Project)
        .options(
            selectinload(Project.milestones)
            .selectinload(Milestone.work_updates),
            selectinload(Project.milestones)
            .selectinload(Milestone.evidence_assets),
            selectinload(Project.milestones)
            .selectinload(Milestone.inspections)
        )
    )

    # Customers, contractors, and inspectors only see projects where they are registered members
    if current_user.role != "admin":
        stmt = stmt.join(
            ProjectMembership,
            (ProjectMembership.project_id == Project.id) & (ProjectMembership.user_id == current_user.id)
        )

    result = await db.execute(stmt)
    projects = result.scalars().all()
    return projects

@router.get("/active", response_model=ProjectResponse)
async def get_active_project(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Returns the primary active residential project with authorization filtering."""
    stmt = (
        select(Project)
        .options(
            selectinload(Project.milestones)
            .selectinload(Milestone.work_updates),
            selectinload(Project.milestones)
            .selectinload(Milestone.evidence_assets),
            selectinload(Project.milestones)
            .selectinload(Milestone.inspections)
        )
    )

    if current_user and current_user.role != "admin":
        stmt = stmt.join(
            ProjectMembership,
            (ProjectMembership.project_id == Project.id) & (ProjectMembership.user_id == current_user.id)
        )

    stmt = stmt.limit(1)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()

    if not project:
        # Fallback to public/demo project if available
        fallback_stmt = select(Project).limit(1)
        fallback_res = await db.execute(fallback_stmt)
        project = fallback_res.scalar_one_or_none()
        if not project:
            raise HTTPException(status_code=404, detail="No active project found")

    return project

@router.get("/{project_id_or_slug}", response_model=ProjectResponse)
async def get_project_by_id_or_slug(
    project_id_or_slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves a specific project by UUID or slug with membership authorization."""
    stmt = (
        select(Project)
        .where((Project.id == project_id_or_slug) | (Project.slug == project_id_or_slug))
        .options(
            selectinload(Project.milestones)
            .selectinload(Milestone.work_updates),
            selectinload(Project.milestones)
            .selectinload(Milestone.evidence_assets),
            selectinload(Project.milestones)
            .selectinload(Milestone.inspections)
        )
    )
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id_or_slug}' not found")

    await verify_project_access(project.id, current_user, db)
    return project

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    req: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates project properties. Requires administrator privileges."""
    stmt = (
        select(Project)
        .where(Project.id == project_id)
        .options(
            selectinload(Project.milestones)
            .selectinload(Milestone.work_updates),
            selectinload(Project.milestones)
            .selectinload(Milestone.evidence_assets),
            selectinload(Project.milestones)
            .selectinload(Milestone.inspections)
        )
    )
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only platform administrator can modify project properties
    await verify_project_access(project.id, current_user, db, allowed_roles=["admin"])

    if req.name is not None:
        project.name = req.name
    if req.current_stage is not None:
        project.current_stage = req.current_stage
    if req.camera_stage_index is not None:
        project.camera_stage_index = req.camera_stage_index
    if req.status is not None:
        project.status = req.status

    await db.commit()
    await db.refresh(project)
    return project
