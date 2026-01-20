from ai.session.session_state import SimulationSession, SimulationState
from ai.risk_detection.risk_detection import detect_risk
from ai.mentor_engine.mentor_engine import run_mentor
from ai.prompts.prompt_builder import build_simulator_prompt
from ai.llm.ollama_client import call_ollama


class SimulationController:
    def __init__(self, persona: str, age: int, scenario: str):
        self.session = SimulationSession(persona, age, scenario)
        self.sim_prompt = build_simulator_prompt(persona, age, scenario)

    def _get_limited_history(self, max_exchanges: int = 5) -> str:
        """Return only the last N exchanges from history to prevent LLM hallucination."""
        lines = [line for line in self.session.history.strip().split('\n') if line.strip()]
        # Each exchange = 2 lines (User + Scammer)
        max_lines = max_exchanges * 2
        limited = lines[-max_lines:] if len(lines) > max_lines else lines
        return '\n'.join(limited)

    def _get_last_scammer_message(self) -> str:
        """Extract the last scammer message for mentor context."""
        lines = self.session.history.strip().split('\n')
        for line in reversed(lines):
            if line.startswith("Scammer:"):
                return line.replace("Scammer:", "").strip()
        return ""

    def user_message(self, message: str) -> dict:
        """
        Handles a user message and returns what the frontend should display.
        """

        # If simulation ended, nothing to do
        if self.session.state == SimulationState.ENDED:
            return {
                "mode": "ENDED",
                "message": "Simulation has ended. Please start a new one."
            }

        # Add user message to history
        self.session.add_message("User", message)

        # If mentor screen is active, ignore new scam generation
        if self.session.state == SimulationState.MENTOR:
            return {
                "mode": "MENTOR",
                "message": "Simulation paused. Use Continue or Retry."
            }

        # Risk detection
        risk = detect_risk(message)

        # HIGH RISK → Mentor
        if risk == "HIGH":
            self.session.pause_for_mentor()
            mentor_text = run_mentor(self._get_last_scammer_message(), message)
            return {
                "mode": "MENTOR",
                "risk": risk,
                "message": mentor_text
            }

        # LOW / MEDIUM → Continue simulation
        full_prompt = f"""
{self.sim_prompt}

Conversation so far (last 5 exchanges):
{self._get_limited_history(5)}

Scammer:
"""

        scam_reply = call_ollama(full_prompt)

        # Add scam reply to history
        self.session.add_message("Scammer", scam_reply)

        return {
            "mode": "SIMULATOR",
            "risk": risk,
            "message": scam_reply
        }

    def continue_simulation(self) -> dict:
        """
        Called when user clicks Continue after mentor explanation.
        """
        if self.session.state == SimulationState.MENTOR:
            self.session.resume_simulation()
            return {
                "mode": "SIMULATOR",
                "message": "Simulation resumed. Respond when ready."
            }

        return {
            "mode": "SIMULATOR",
            "message": "Simulation already running."
        }

    def retry_simulation(self) -> dict:
        """
        Called when user clicks Retry.
        """
        self.session.reset()
        return {
            "mode": "ENDED",
            "message": "Simulation reset. Please choose a new scenario."
        }
