from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.all_models import Notification, User
from backend.app.schemas.schemas import NotificationResponse
from backend.app.api.deps import get_current_user, get_optional_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieves notifications for the current authenticated user or public demo notifications."""
    if current_user:
        stmt = (
            select(Notification)
            .where(Notification.user_id == current_user.id)
            .order_by(Notification.created_at.desc())
        )
    else:
        stmt = (
            select(Notification)
            .order_by(Notification.created_at.desc())
            .limit(10)
        )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marks a single notification as read for the authenticated user."""
    stmt = select(Notification).where(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    )
    res = await db.execute(stmt)
    notif = res.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.read = True
    await db.commit()
    await db.refresh(notif)
    return notif

@router.post("/mark-all-read")
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marks all user notifications as read."""
    stmt = (
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .values(read=True)
    )
    await db.execute(stmt)
    await db.commit()
    return {"message": "All notifications marked as read"}
