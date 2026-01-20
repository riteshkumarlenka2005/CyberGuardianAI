"""
Simulation API routes.
Handles scam simulation sessions with the local Ollama + Mistral model.
"""

from fastapi import APIRouter, HTTPException, Depends

from ...schemas.simulation import (
    StartSimulationRequest,
    MessageRequest,
    SessionRequest,
    SimulationResponse,
    SimulationMode,
    RiskLevel
)
from ...services.session_store import session_store

from ...security.jwt import require_auth

router = APIRouter(dependencies=[Depends(require_auth)])


# Mapping from frontend values to backend values
PERSONA_MAP = {
    "STUDENT": "student",
    "JOB_SEEKER": "job_seeker",
    "SENIOR_CITIZEN": "senior_citizen",
    "TEENAGER": "teenager",
    "GENERAL_USER": "general",
    # Also accept lowercase directly
    "student": "student",
    "job_seeker": "job_seeker",
    "senior_citizen": "senior_citizen",
    "teenager": "teenager",
    "general": "general",
}

SCENARIO_MAP = {
    "BANK": "bank",
    "GOVERNMENT": "government",
    "JOB": "job_offer",
    "EMERGENCY": "relative_emergency",
    # Also accept backend values directly
    "bank": "bank",
    "government": "government",
    "job_offer": "job_offer",
    "relative_emergency": "relative_emergency",
    "lottery_offer": "lottery_offer",
}


@router.post("/start", response_model=SimulationResponse)
async def start_simulation(request: StartSimulationRequest):
    """
    Start a new simulation session.
    Returns session_id and initial scammer message.
    """
    # Map frontend values to backend values
    persona = PERSONA_MAP.get(request.persona, request.persona)
    scenario = SCENARIO_MAP.get(request.scenario, request.scenario)
    
    # Create new session
    session_id = session_store.create_session(persona, request.age, scenario)
    controller = session_store.get_session(session_id)
    
    if not controller:
        raise HTTPException(status_code=500, detail="Failed to create session")
    
    # Generate initial scammer message
    # We'll send an empty "start" to get the first message
    result = controller.user_message("Hello")
    
    return SimulationResponse(
        mode=SimulationMode.SIMULATOR,
        message=result.get("message", ""),
        risk=RiskLevel.LOW if result.get("risk") == "LOW" else None,
        session_id=session_id
    )


@router.post("/message", response_model=SimulationResponse)
async def send_message(request: MessageRequest):
    """
    Send a user message and get the scammer/mentor response.
    """
    controller = session_store.get_session(request.session_id)
    
    if not controller:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Process user message
    result = controller.user_message(request.message)
    
    # Map mode
    mode_str = result.get("mode", "SIMULATOR")
    if mode_str == "MENTOR":
        mode = SimulationMode.MENTOR
    elif mode_str == "ENDED":
        mode = SimulationMode.ENDED
    else:
        mode = SimulationMode.SIMULATOR
    
    # Map risk
    risk_str = result.get("risk")
    risk = None
    if risk_str == "HIGH":
        risk = RiskLevel.HIGH
    elif risk_str == "MEDIUM":
        risk = RiskLevel.MEDIUM
    elif risk_str == "LOW":
        risk = RiskLevel.LOW
    
    return SimulationResponse(
        mode=mode,
        message=result.get("message", ""),
        risk=risk,
        session_id=request.session_id
    )


@router.post("/continue", response_model=SimulationResponse)
async def continue_simulation(request: SessionRequest):
    """
    Continue simulation after mentor intervention.
    """
    controller = session_store.get_session(request.session_id)
    
    if not controller:
        raise HTTPException(status_code=404, detail="Session not found")
    
    result = controller.continue_simulation()
    
    return SimulationResponse(
        mode=SimulationMode.SIMULATOR,
        message=result.get("message", ""),
        session_id=request.session_id
    )


@router.post("/retry", response_model=SimulationResponse)
async def retry_simulation(request: SessionRequest):
    """
    Reset and restart the simulation.
    """
    controller = session_store.get_session(request.session_id)
    
    if not controller:
        raise HTTPException(status_code=404, detail="Session not found")
    
    result = controller.retry_simulation()
    
    # Delete the old session
    session_store.delete_session(request.session_id)
    
    return SimulationResponse(
        mode=SimulationMode.ENDED,
        message=result.get("message", ""),
        session_id=None
    )


@router.get("/active-sessions")
async def get_active_sessions():
    """
    Get the count of active simulation sessions (for monitoring).
    """
    return {"active_sessions": session_store.get_active_count()}
