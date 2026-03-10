"""
Progress Service for CyberGuardian AI.
Business logic for user progress, training sessions, badges, and daily stats.
"""

from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.progress import (
    UserProgress, TrainingSession, BadgeDefinition, UserBadge, DailyStat
)


async def get_or_create_progress(db: AsyncSession, user_id: int) -> UserProgress:
    """Get or create a user's progress record."""
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == user_id)
    )
    progress = result.scalar_one_or_none()

    if not progress:
        progress = UserProgress(user_id=user_id, tactics_learned=[])
        db.add(progress)
        await db.flush()

    return progress


async def get_all_badges_for_user(db: AsyncSession, user_id: int) -> List[Dict[str, Any]]:
    """Get all badge definitions with the user's earned status."""
    # Get all badge definitions
    result = await db.execute(select(BadgeDefinition))
    badge_defs = result.scalars().all()

    # Get user's earned badges
    result = await db.execute(
        select(UserBadge).where(UserBadge.user_id == user_id)
    )
    user_badges = {ub.badge_id: ub.earned_at for ub in result.scalars().all()}

    badges = []
    for bd in badge_defs:
        requirement = {"type": bd.requirement_type, "value": bd.requirement_value}
        if bd.requirement_scenario_type:
            requirement["scenarioType"] = bd.requirement_scenario_type

        earned_at = user_badges.get(bd.id)
        badges.append({
            "id": bd.badge_key,
            "name": bd.name,
            "icon": bd.icon,
            "description": bd.description,
            "earnedAt": int(earned_at.timestamp() * 1000) if earned_at else None,
            "requirement": requirement,
        })

    return badges


async def get_daily_stats(db: AsyncSession, user_id: int, days: int = 30) -> List[Dict[str, Any]]:
    """Get daily stats for the last N days."""
    cutoff = date.today() - timedelta(days=days)
    result = await db.execute(
        select(DailyStat)
        .where(and_(DailyStat.user_id == user_id, DailyStat.stat_date >= cutoff))
        .order_by(DailyStat.stat_date.desc())
    )
    stats = result.scalars().all()

    return [
        {
            "date": s.stat_date.isoformat(),
            "sessionsCompleted": s.sessions_completed,
            "correctDecisions": s.correct_decisions,
            "mistakesCaught": s.mistakes_caught,
        }
        for s in stats
    ]


async def get_chart_data(db: AsyncSession, user_id: int, days: int = 7) -> List[Dict[str, Any]]:
    """Get chart data for the last N days (with zero-filled gaps)."""
    today = date.today()
    cutoff = today - timedelta(days=days - 1)

    result = await db.execute(
        select(DailyStat)
        .where(and_(DailyStat.user_id == user_id, DailyStat.stat_date >= cutoff))
    )
    stats_by_date = {s.stat_date: s for s in result.scalars().all()}

    chart_data = []
    for i in range(days):
        d = cutoff + timedelta(days=i)
        s = stats_by_date.get(d)
        chart_data.append({
            "date": d.isoformat(),
            "sessionsCompleted": s.sessions_completed if s else 0,
            "correctDecisions": s.correct_decisions if s else 0,
            "mistakesCaught": s.mistakes_caught if s else 0,
        })

    return chart_data


def _calculate_score(progress: UserProgress, earned_badge_count: int) -> int:
    """Calculate safety score (0-1000)."""
    score = 0

    # Base score from sessions (up to 300 points)
    score += min(progress.total_sessions * 30, 300)

    # Score from tactics learned (up to 200 points)
    tactics_count = len(progress.tactics_learned) if progress.tactics_learned else 0
    score += min(tactics_count * 40, 200)

    # Score from earned badges (up to 300 points)
    score += min(earned_badge_count * 30, 300)

    # Score from streak (up to 100 points)
    score += min(progress.streak * 15, 100)

    # Bonus for variety (up to 100 points)
    scenarios_completed = sum(1 for v in [
        progress.bank_completed, progress.job_completed,
        progress.government_completed, progress.emergency_completed
    ] if v > 0)
    score += scenarios_completed * 25

    return min(score, 1000)


def _calculate_streak(last_session_date: Optional[date], current_streak: int) -> int:
    """Calculate streak based on last session date."""
    if last_session_date is None:
        return 1

    today = date.today()
    diff = (today - last_session_date).days

    if diff == 0:
        return current_streak  # Same day
    if diff == 1:
        return current_streak + 1  # Consecutive day
    return 1  # Streak broken


async def _check_and_award_badges(db: AsyncSession, user_id: int, progress: UserProgress) -> List[Dict[str, Any]]:
    """Check badge conditions and award new badges. Returns list of newly earned badges."""
    # Get all badge definitions
    result = await db.execute(select(BadgeDefinition))
    all_badges = result.scalars().all()

    # Get already earned badge IDs
    result = await db.execute(
        select(UserBadge.badge_id).where(UserBadge.user_id == user_id)
    )
    earned_ids = {row[0] for row in result.all()}

    new_badges = []
    for bd in all_badges:
        if bd.id in earned_ids:
            continue

        earned = False
        if bd.requirement_type == "sessions":
            earned = progress.total_sessions >= bd.requirement_value
        elif bd.requirement_type == "scenario_type":
            scenario_map = {
                "BANK": progress.bank_completed,
                "JOB": progress.job_completed,
                "GOVERNMENT": progress.government_completed,
                "EMERGENCY": progress.emergency_completed,
            }
            count = scenario_map.get(bd.requirement_scenario_type, 0)
            earned = count >= bd.requirement_value
        elif bd.requirement_type == "tactics":
            tactics_count = len(progress.tactics_learned) if progress.tactics_learned else 0
            earned = tactics_count >= bd.requirement_value
        elif bd.requirement_type == "streak":
            earned = progress.streak >= bd.requirement_value

        if earned:
            now = datetime.utcnow()
            user_badge = UserBadge(user_id=user_id, badge_id=bd.id, earned_at=now)
            db.add(user_badge)
            requirement = {"type": bd.requirement_type, "value": bd.requirement_value}
            if bd.requirement_scenario_type:
                requirement["scenarioType"] = bd.requirement_scenario_type
            new_badges.append({
                "id": bd.badge_key,
                "name": bd.name,
                "icon": bd.icon,
                "description": bd.description,
                "earnedAt": int(now.timestamp() * 1000),
                "requirement": requirement,
            })

    return new_badges


async def save_session(
    db: AsyncSession,
    user_id: int,
    scenario_type: str,
    identity: str,
    age_group: Optional[str],
    messages_count: int,
    mentor_interventions: int,
    tactics_encountered: List[str],
    completed: bool,
    duration: int,
) -> Dict[str, Any]:
    """Save a training session and update all progress."""
    today = date.today()

    # 1. Create training session record
    session = TrainingSession(
        user_id=user_id,
        scenario_type=scenario_type,
        identity=identity,
        age_group=age_group,
        messages_count=messages_count,
        mentor_interventions=mentor_interventions,
        tactics_encountered=tactics_encountered or [],
        completed=completed,
        duration=duration,
        completed_at=datetime.utcnow() if completed else None,
    )
    db.add(session)

    # 2. Update user progress
    progress = await get_or_create_progress(db, user_id)

    progress.total_sessions += 1
    progress.total_mentor_interventions += mentor_interventions
    progress.total_messages_exchanged += messages_count
    progress.total_time_spent += duration

    # Update scenario-specific count
    scenario_upper = scenario_type.upper()
    if scenario_upper == "BANK":
        progress.bank_completed += 1
    elif scenario_upper == "JOB":
        progress.job_completed += 1
    elif scenario_upper == "GOVERNMENT":
        progress.government_completed += 1
    elif scenario_upper == "EMERGENCY":
        progress.emergency_completed += 1

    # Update tactics learned (unique)
    current_tactics = list(progress.tactics_learned or [])
    for tactic in (tactics_encountered or []):
        if tactic not in current_tactics:
            current_tactics.append(tactic)
    progress.tactics_learned = current_tactics

    # Update streak
    progress.streak = _calculate_streak(progress.last_session_date, progress.streak)
    progress.last_session_date = today

    # 3. Update daily stats
    result = await db.execute(
        select(DailyStat).where(
            and_(DailyStat.user_id == user_id, DailyStat.stat_date == today)
        )
    )
    daily = result.scalar_one_or_none()

    if daily:
        daily.sessions_completed += 1
        daily.mistakes_caught += mentor_interventions
        daily.correct_decisions += max(0, messages_count - mentor_interventions)
    else:
        daily = DailyStat(
            user_id=user_id,
            stat_date=today,
            sessions_completed=1,
            mistakes_caught=mentor_interventions,
            correct_decisions=max(0, messages_count - mentor_interventions),
        )
        db.add(daily)

    # 4. Check and award new badges
    new_badges = await _check_and_award_badges(db, user_id, progress)

    # 5. Recalculate safety score
    result = await db.execute(
        select(func.count(UserBadge.id)).where(UserBadge.user_id == user_id)
    )
    earned_count = result.scalar() or 0
    earned_count += len(new_badges)  # Include just-awarded badges
    progress.safety_score = _calculate_score(progress, earned_count)

    await db.flush()

    return {
        "success": True,
        "message": "Session saved successfully",
        "newBadges": new_badges,
    }


async def get_full_progress(db: AsyncSession, user_id: int) -> Dict[str, Any]:
    """Get the full user progress response."""
    progress = await get_or_create_progress(db, user_id)
    badges = await get_all_badges_for_user(db, user_id)
    daily_stats = await get_daily_stats(db, user_id, days=30)

    # Count earned badges for score
    earned_count = sum(1 for b in badges if b["earnedAt"] is not None)
    score = _calculate_score(progress, earned_count)

    # Update stored score if changed
    if progress.safety_score != score:
        progress.safety_score = score
        await db.flush()

    return {
        "totalSessions": progress.total_sessions,
        "scenariosCompleted": {
            "BANK": progress.bank_completed,
            "JOB": progress.job_completed,
            "GOVERNMENT": progress.government_completed,
            "EMERGENCY": progress.emergency_completed,
        },
        "totalMentorInterventions": progress.total_mentor_interventions,
        "tacticsLearned": progress.tactics_learned or [],
        "totalMessagesExchanged": progress.total_messages_exchanged,
        "totalTimeSpent": progress.total_time_spent,
        "dailyStats": daily_stats,
        "badges": badges,
        "lastSessionDate": progress.last_session_date.isoformat() if progress.last_session_date else None,
        "streak": progress.streak,
        "safetyScore": score,
    }


async def calculate_score(db: AsyncSession, user_id: int) -> int:
    """Calculate the user's safety score."""
    progress = await get_or_create_progress(db, user_id)
    result = await db.execute(
        select(func.count(UserBadge.id)).where(UserBadge.user_id == user_id)
    )
    earned_count = result.scalar() or 0
    return _calculate_score(progress, earned_count)
