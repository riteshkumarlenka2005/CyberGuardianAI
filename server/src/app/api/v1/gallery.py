"""Gallery API routes - public read + admin CRUD."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ...database import get_db
from ...models.content import GalleryItem
from ...schemas.content import GalleryItemCreate, GalleryItemResponse
from ...security.jwt import require_admin

router = APIRouter(prefix="/gallery", tags=["Gallery"])


@router.get("/", response_model=List[GalleryItemResponse])
async def list_gallery_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GalleryItem)
        .where(GalleryItem.is_active == True)
        .order_by(GalleryItem.display_order, GalleryItem.id)
    )
    return result.scalars().all()


@router.post("/", response_model=GalleryItemResponse)
async def create_gallery_item(
    item: GalleryItemCreate,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    db_item = GalleryItem(
        title=item.title,
        image_url=item.image_url,
        category=item.category,
        frame_type=item.frame_type,
        display_order=item.display_order,
        created_by=int(admin["id"]),
    )
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
async def delete_gallery_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    result = await db.execute(select(GalleryItem).where(GalleryItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.is_active = False
    await db.commit()
    return {"message": "Deleted"}
