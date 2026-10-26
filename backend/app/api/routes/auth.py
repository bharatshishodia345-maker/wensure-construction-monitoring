from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from backend.app.database import get_db
from backend.app.models.all_models import User
from backend.app.schemas.schemas import (
    LoginRequest, TokenResponse, UserResponse, UserCreate
)
from backend.app.services.auth_service import (
    verify_password, hash_password, create_access_token
)
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RoleSwitchRequest(BaseModel):
    role: str  # customer, contractor, admin, inspector

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticates user with email and password or demo credentials."""
    stmt = select(User).where(User.email == req.email.strip().lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.full_name
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

from backend.app.config import settings

@router.post("/demo-login", response_model=TokenResponse)
async def demo_login(role: str = "customer", db: AsyncSession = Depends(get_db)):
    """Quick demo authentication endpoint for local development testing."""
    if settings.APP_ENV == "production":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo authentication is disabled in production environments"
        )

    valid_roles = ["customer", "contractor", "admin", "inspector"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid demo role. Choose from {valid_roles}")

    stmt = select(User).where(User.role == role)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail=f"No user found with role {role}")

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.full_name
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user's profile."""
    return current_user

@router.post("/switch-role")
async def switch_active_role(
    req: RoleSwitchRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Disabled for security: users cannot alter their own persisted roles.
    Role assignment must be performed through server-side administrative assignment.
    """
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Role escalation prohibited: persistent roles cannot be self-modified. Contact a platform administrator."
    )
