"""
In-memory session store for simulation controllers.
Stores SimulationController instances per session_id.
"""

import uuid
from typing import Dict, Optional
import sys
import os

# Ensure server root is on sys.path so "ai" package is importable
_server_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
if _server_root not in sys.path:
    sys.path.insert(0, _server_root)

from ai.controller.simulation_controller import SimulationController


class SessionStore:
    """
    In-memory store for active simulation sessions.
    In production, this should be replaced with Redis or database storage.
    """
    
    def __init__(self):
        self._sessions: Dict[str, SimulationController] = {}
    
    def create_session(self, persona: str, age: int, scenario: str) -> str:
        """
        Create a new simulation session and return the session_id.
        """
        session_id = str(uuid.uuid4())
        controller = SimulationController(persona, age, scenario)
        self._sessions[session_id] = controller
        return session_id
    
    def get_session(self, session_id: str) -> Optional[SimulationController]:
        """
        Get a simulation controller by session_id.
        """
        return self._sessions.get(session_id)
    
    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session by session_id.
        """
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False
    
    def get_active_count(self) -> int:
        """
        Get the number of active sessions.
        """
        return len(self._sessions)


# Global session store instance
session_store = SessionStore()
