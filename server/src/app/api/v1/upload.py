"""File upload API routes - admin only."""

import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException

from ...security.jwt import require_admin

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "uploads")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/ogg", "video/quicktime"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024   # 10 MB
MAX_VIDEO_SIZE = 200 * 1024 * 1024  # 200 MB


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid image type: {file.content_type}")

    data = await file.read()
    if len(data) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image exceeds 10 MB limit")

    ext = _get_extension(file.filename, file.content_type)
    filename = f"{uuid.uuid4().hex}{ext}"
    os.makedirs(os.path.join(UPLOAD_DIR, "images"), exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, "images", filename)

    with open(filepath, "wb") as f:
        f.write(data)

    return {"url": f"/uploads/images/{filename}"}


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin),
):
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid video type: {file.content_type}")

    os.makedirs(os.path.join(UPLOAD_DIR, "videos"), exist_ok=True)
    ext = _get_extension(file.filename, file.content_type)
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, "videos", filename)

    # Stream write for large videos
    size = 0
    with open(filepath, "wb") as f:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_VIDEO_SIZE:
                f.close()
                os.remove(filepath)
                raise HTTPException(status_code=400, detail="Video exceeds 200 MB limit")
            f.write(chunk)

    return {"url": f"/uploads/videos/{filename}"}


def _get_extension(filename: str | None, content_type: str) -> str:
    if filename and "." in filename:
        return "." + filename.rsplit(".", 1)[1].lower()
    mime_map = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "video/mp4": ".mp4",
        "video/webm": ".webm",
        "video/ogg": ".ogv",
        "video/quicktime": ".mov",
    }
    return mime_map.get(content_type, "")
