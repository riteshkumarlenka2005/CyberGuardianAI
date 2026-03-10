"""Schemas for gallery and resource content."""

from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


# --- Gallery ---
class GalleryItemCreate(BaseModel):
    title: str
    image_url: str
    category: str = "general"
    frame_type: str = "A"
    display_order: int = 0

class GalleryItemResponse(BaseModel):
    id: int
    title: str
    image_url: str
    category: str
    frame_type: str
    display_order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Resource Alerts ---
class ResourceAlertCreate(BaseModel):
    title: str
    tag: str = "ALERT"
    date_text: str = ""
    display_order: int = 0

class ResourceAlertResponse(BaseModel):
    id: int
    title: str
    tag: str
    date_text: str
    display_order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Resource Videos ---
class ResourceVideoCreate(BaseModel):
    title: str
    thumbnail_url: str = ""
    video_url: str = ""
    duration: str = ""
    label: str = "VIDEO"
    display_order: int = 0

class ResourceVideoResponse(BaseModel):
    id: int
    title: str
    thumbnail_url: str
    video_url: str
    duration: str
    label: str
    display_order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Resource Links ---
class ResourceLinkCreate(BaseModel):
    name: str
    url: str
    category: str = "official"
    display_order: int = 0

class ResourceLinkResponse(BaseModel):
    id: int
    name: str
    url: str
    category: str
    display_order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
