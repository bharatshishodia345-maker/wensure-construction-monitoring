from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from backend.app.database import get_db
from backend.app.models.all_models import ContractorProfile, User
from backend.app.schemas.schemas import ContractorProfileResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/contractors", tags=["Contractor Directory"])

@router.get("", response_model=List[ContractorProfileResponse])
@router.get("/directory", response_model=List[ContractorProfileResponse])
async def list_contractors(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns verified contractor profiles with trust scores."""
    stmt = select(ContractorProfile).order_by(ContractorProfile.trust_score.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{contractor_id}", response_model=ContractorProfileResponse)
async def get_contractor(
    contractor_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves single contractor profile details."""
    stmt = select(ContractorProfile).where(ContractorProfile.id == contractor_id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return profile
