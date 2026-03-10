"""Admin API routes - dashboard stats + user management."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ...database import get_db
from ...models.user import User
from ...models.content import GalleryItem, ResourceAlert, ResourceVideo, ResourceLink
from ...security.jwt import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def admin_stats(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    users = await db.execute(select(func.count(User.id)))
    gallery = await db.execute(select(func.count(GalleryItem.id)).where(GalleryItem.is_active == True))
    alerts = await db.execute(select(func.count(ResourceAlert.id)).where(ResourceAlert.is_active == True))
    videos = await db.execute(select(func.count(ResourceVideo.id)).where(ResourceVideo.is_active == True))
    links = await db.execute(select(func.count(ResourceLink.id)).where(ResourceLink.is_active == True))

    return {
        "total_users": users.scalar() or 0,
        "gallery_items": gallery.scalar() or 0,
        "resource_alerts": alerts.scalar() or 0,
        "resource_videos": videos.scalar() or 0,
        "resource_links": links.scalar() or 0,
    }


@router.get("/users")
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    result = await db.execute(
        select(
            User.id, User.email, User.first_name, User.last_name,
            User.role, User.is_active, User.email_verified, User.provider,
            User.created_at
        ).order_by(User.created_at.desc())
    )
    rows = result.all()
    return [
        {
            "id": r.id, "email": r.email,
            "first_name": r.first_name, "last_name": r.last_name,
            "role": r.role, "is_active": r.is_active,
            "email_verified": r.email_verified, "provider": r.provider,
            "created_at": str(r.created_at) if r.created_at else None,
        }
        for r in rows
    ]
