"""
Pydantic schemas for progress/training API endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# --- Request Schemas ---

class SaveSessionRequest(BaseModel):
    """Request body when saving a completed training session."""
    scenario_type: str
    identity: str
    age_group: Optional[str] = None
    messages_count: int = 0
    mentor_interventions: int = 0
    tactics_encountered: List[str] = []
    completed: bool = False
    duration: int = 0


# --- Response Schemas ---

class BadgeResponse(BaseModel):
    id: str  # badge_key
    name: str
    icon: str
    description: str
    earnedAt: Optional[int] = None  # timestamp ms or null
    requirement: dict

    class Config:
        from_attributes = True


class DailyStatsResponse(BaseModel):
    date: str
    sessionsCompleted: int
    correctDecisions: int
    mistakesCaught: int


class UserProgressResponse(BaseModel):
    totalSessions: int
    scenariosCompleted: dict  # {BANK: n, JOB: n, ...}
    totalMentorInterventions: int
    tacticsLearned: List[str]
    totalMessagesExchanged: int
    totalTimeSpent: int
    dailyStats: List[DailyStatsResponse]
    badges: List[BadgeResponse]
    lastSessionDate: Optional[str] = None
    streak: int
    safetyScore: int


class ChartDataResponse(BaseModel):
    data: List[DailyStatsResponse]


class ScoreResponse(BaseModel):
    score: int


class SessionSavedResponse(BaseModel):
    success: bool
    message: str
    newBadges: List[BadgeResponse] = []
