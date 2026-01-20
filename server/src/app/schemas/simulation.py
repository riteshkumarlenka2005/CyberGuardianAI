"""
Pydantic schemas for simulation API endpoints.
"""

from pydantic import BaseModel
from typing import Optional
from enum import Enum


class SimulationMode(str, Enum):
    SIMULATOR = "SIMULATOR"
    MENTOR = "MENTOR"
    ENDED = "ENDED"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class StartSimulationRequest(BaseModel):
    """Request to start a new simulation session."""
    persona: str  # student, job_seeker, senior_citizen, teenager, general
    age: int
    scenario: str  # bank, government, job_offer, relative_emergency, lottery_offer


class MessageRequest(BaseModel):
    """Request to send a message in an active simulation."""
    session_id: str
    message: str


class SessionRequest(BaseModel):
    """Request for session-based operations (continue/retry)."""
    session_id: str


class SimulationResponse(BaseModel):
    """Response from simulation endpoints."""
    mode: SimulationMode
    message: str
    risk: Optional[RiskLevel] = None
    session_id: Optional[str] = None
    manipulation_tactic: Optional[str] = None
    guidance: Optional[str] = None
