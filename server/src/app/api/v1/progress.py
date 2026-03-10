"""
Progress API Router for CyberGuardian AI.
Endpoints for user progress, training sessions, badges, and daily stats.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from ...database import get_db
from ...security.jwt import require_auth
from ...services import progress_service
from ...schemas.progress import SaveSessionRequest

router = APIRouter()


@router.get("/")
async def get_progress(
    current_user: Dict[str, Any] = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """Get the full user progress including badges, daily stats, and score."""
    user_id = int(current_user["id"])
    return await progress_service.get_full_progress(db, user_id)


@router.post("/session")
async def save_session(
    request: SaveSessionRequest,
    current_user: Dict[str, Any] = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """Save a completed training session and update all progress."""
    user_id = int(current_user["id"])
    return await progress_service.save_session(
        db=db,
        user_id=user_id,
        scenario_type=request.scenario_type,
        identity=request.identity,
        age_group=request.age_group,
        messages_count=request.messages_count,
        mentor_interventions=request.mentor_interventions,
        tactics_encountered=request.tactics_encountered,
        completed=request.completed,
        duration=request.duration,
    )


@router.get("/chart-data")
async def get_chart_data(
    days: int = Query(default=7, ge=1, le=90),
    current_user: Dict[str, Any] = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """Get chart data for the last N days."""
    user_id = int(current_user["id"])
    data = await progress_service.get_chart_data(db, user_id, days)
    return {"data": data}


@router.get("/score")
async def get_score(
    current_user: Dict[str, Any] = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """Get the user's safety score."""
    user_id = int(current_user["id"])
    score = await progress_service.calculate_score(db, user_id)
    return {"score": score}


@router.get("/badges")
async def get_badges(
    current_user: Dict[str, Any] = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """Get all badges with the user's earned status."""
    user_id = int(current_user["id"])
    badges = await progress_service.get_all_badges_for_user(db, user_id)
    return {"badges": badges}
