"""
Database models for user progress, training sessions, badges, and daily stats.
"""

from datetime import datetime, date
from sqlalchemy import (
    String, Boolean, DateTime, Date, Integer, Text, ARRAY,
    ForeignKey, UniqueConstraint, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    total_sessions: Mapped[int] = mapped_column(Integer, default=0)
    total_mentor_interventions: Mapped[int] = mapped_column(Integer, default=0)
    total_messages_exchanged: Mapped[int] = mapped_column(Integer, default=0)
    total_time_spent: Mapped[int] = mapped_column(Integer, default=0)

    bank_completed: Mapped[int] = mapped_column(Integer, default=0)
    job_completed: Mapped[int] = mapped_column(Integer, default=0)
    government_completed: Mapped[int] = mapped_column(Integer, default=0)
    emergency_completed: Mapped[int] = mapped_column(Integer, default=0)

    tactics_learned: Mapped[list] = mapped_column(ARRAY(Text), default=list)

    streak: Mapped[int] = mapped_column(Integer, default=0)
    last_session_date: Mapped[date] = mapped_column(Date, nullable=True)
    safety_score: Mapped[int] = mapped_column(Integer, default=0)

    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<UserProgress user_id={self.user_id}>"


class TrainingSession(Base):
    __tablename__ = "training_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    scenario_type: Mapped[str] = mapped_column(String(20), nullable=False)
    identity: Mapped[str] = mapped_column(String(20), nullable=False)
    age_group: Mapped[str] = mapped_column(String(20), nullable=True)

    messages_count: Mapped[int] = mapped_column(Integer, default=0)
    mentor_interventions: Mapped[int] = mapped_column(Integer, default=0)
    tactics_encountered: Mapped[list] = mapped_column(ARRAY(Text), default=list)

    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    duration: Mapped[int] = mapped_column(Integer, default=0)

    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f"<TrainingSession id={self.id} user={self.user_id} scenario={self.scenario_type}>"


class BadgeDefinition(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    badge_key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    icon: Mapped[str] = mapped_column(String(10), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirement_type: Mapped[str] = mapped_column(String(20), nullable=False)
    requirement_value: Mapped[int] = mapped_column(Integer, nullable=False)
    requirement_scenario_type: Mapped[str] = mapped_column(String(20), nullable=True)

    def __repr__(self):
        return f"<Badge {self.badge_key}>"


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id: Mapped[int] = mapped_column(Integer, ForeignKey("badges.id", ondelete="CASCADE"), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<UserBadge user={self.user_id} badge={self.badge_id}>"


class DailyStat(Base):
    __tablename__ = "daily_stats"
    __table_args__ = (
        UniqueConstraint("user_id", "stat_date", name="uq_user_daily_stat"),
        Index("idx_daily_stats_user_date", "user_id", "stat_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stat_date: Mapped[date] = mapped_column(Date, nullable=False)

    sessions_completed: Mapped[int] = mapped_column(Integer, default=0)
    correct_decisions: Mapped[int] = mapped_column(Integer, default=0)
    mistakes_caught: Mapped[int] = mapped_column(Integer, default=0)

    def __repr__(self):
        return f"<DailyStat user={self.user_id} date={self.stat_date}>"
