"""Resources API routes - public read + admin CRUD."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ...database import get_db
from ...models.content import ResourceAlert, ResourceVideo, ResourceLink
from ...schemas.content import (
    ResourceAlertCreate, ResourceAlertResponse,
    ResourceVideoCreate, ResourceVideoResponse,
    ResourceLinkCreate, ResourceLinkResponse,
)
from ...security.jwt import require_admin

router = APIRouter(prefix="/resources", tags=["Resources"])


# --- Alerts ---
@router.get("/alerts", response_model=List[ResourceAlertResponse])
async def list_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResourceAlert)
        .where(ResourceAlert.is_active == True)
        .order_by(ResourceAlert.display_order, ResourceAlert.id)
    )
    return result.scalars().all()


@router.post("/alerts", response_model=ResourceAlertResponse)
async def create_alert(
    item: ResourceAlertCreate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    db_item = ResourceAlert(**item.model_dump(), created_by=int(admin["id"]))
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item


@router.delete("/alerts/{item_id}")
async def delete_alert(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    result = await db.execute(select(ResourceAlert).where(ResourceAlert.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Alert not found")
    item.is_active = False
    await db.commit()
    return {"message": "Deleted"}


# --- Videos ---
@router.get("/videos", response_model=List[ResourceVideoResponse])
async def list_videos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResourceVideo)
        .where(ResourceVideo.is_active == True)
        .order_by(ResourceVideo.display_order, ResourceVideo.id)
    )
    return result.scalars().all()


@router.post("/videos", response_model=ResourceVideoResponse)
async def create_video(
    item: ResourceVideoCreate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    db_item = ResourceVideo(**item.model_dump(), created_by=int(admin["id"]))
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item


@router.delete("/videos/{item_id}")
async def delete_video(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    result = await db.execute(select(ResourceVideo).where(ResourceVideo.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Video not found")
    item.is_active = False
    await db.commit()
    return {"message": "Deleted"}


# --- Links ---
@router.get("/links", response_model=List[ResourceLinkResponse])
async def list_links(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResourceLink)
        .where(ResourceLink.is_active == True)
        .order_by(ResourceLink.display_order, ResourceLink.id)
    )
    return result.scalars().all()


@router.post("/links", response_model=ResourceLinkResponse)
async def create_link(
    item: ResourceLinkCreate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    db_item = ResourceLink(**item.model_dump(), created_by=int(admin["id"]))
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item


@router.delete("/links/{item_id}")
async def delete_link(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    result = await db.execute(select(ResourceLink).where(ResourceLink.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Link not found")
    item.is_active = False
    await db.commit()
    return {"message": "Deleted"}
