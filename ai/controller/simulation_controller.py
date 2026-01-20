"""
Production-level simulation controller for CyberGuardian AI.
Orchestrates the scam simulation with full persona/scenario context.
"""

from ai.session.session_state import SimulationSession, SimulationState
from ai.risk_detection.risk_detection import detect_risk
from ai.mentor_engine.mentor_engine import run_mentor, get_quick_tip
from ai.prompts.prompt_builder import build_simulator_prompt, build_initial_message_prompt
from ai.llm.ollama_client import call_ollama


class SimulationController:
    """
    Controls the scam simulation flow with deterministic state management.
    
    Key guarantees:
    - HIGH risk ALWAYS triggers mentor, NEVER calls scammer LLM
    - Persona/scenario context flows to all components
    - Conversation history is limited to prevent hallucination
    """
    
    def __init__(self, persona: str, age: int, scenario: str):
        self.session = SimulationSession(persona, age, scenario)
        self.sim_prompt = build_simulator_prompt(persona, age, scenario)
        self.initial_prompt = build_initial_message_prompt(persona, age, scenario)
        
        # Store context for mentor
        self.persona = persona
        self.age = age
        self.scenario = scenario

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

    def start_simulation(self) -> dict:
        """
        Generate the first scammer message to start the simulation.
        Called when user enters the simulation.
        """
        if self.session.state != SimulationState.SIMULATING:
            return {
                "mode": "ENDED",
                "message": "Simulation has ended. Please start a new one."
            }
        
        # Generate initial scammer message
        initial_message = call_ollama(self.initial_prompt)
        
        # Add to history
        self.session.add_message("Scammer", initial_message)
        
        return {
            "mode": "SIMULATOR",
            "risk": "LOW",
            "message": initial_message,
            "persona": self.persona,
            "scenario": self.scenario
        }

    def user_message(self, message: str) -> dict:
        """
        Process user message and return appropriate response.
        
        CRITICAL CONTROL FLOW:
        1. Check if simulation ended -> return ended state
        2. Add user message to history
        3. Check if mentor active -> block new messages
        4. Detect risk level
        5. If HIGH risk -> trigger mentor, DO NOT call scammer LLM
        6. If LOW/MEDIUM -> call scammer LLM
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
                "message": "Simulation paused. Use Continue or Retry.",
                "quick_tip": get_quick_tip(self.persona, self.scenario)
            }

        # === CRITICAL: RISK DETECTION BEFORE LLM CALL ===
        risk = detect_risk(message, self.scenario)

        # HIGH RISK → Mentor takes over, NO scammer LLM call
        if risk == "HIGH":
            self.session.pause_for_mentor()
            
            # Get persona-aware mentor explanation
            mentor_text = run_mentor(
                last_scammer_message=self._get_last_scammer_message(),
                user_risky_reply=message,
                persona=self.persona,
                age=self.age,
                scenario=self.scenario
            )
            
            return {
                "mode": "MENTOR",
                "risk": risk,
                "message": mentor_text,
                "quick_tip": get_quick_tip(self.persona, self.scenario)
            }

        # LOW / MEDIUM → Continue simulation with scammer LLM
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
        Resumes the simulation from where it paused.
        """
        if self.session.state == SimulationState.MENTOR:
            self.session.resume_simulation()
            return {
                "mode": "SIMULATOR",
                "message": "Simulation resumed. What would you like to respond?",
                "last_scammer_message": self._get_last_scammer_message()
            }

        return {
            "mode": "SIMULATOR",
            "message": "Simulation already running."
        }

    def retry_simulation(self) -> dict:
        """
        Called when user clicks Retry.
        Ends the current simulation.
        """
        self.session.reset()
        return {
            "mode": "ENDED",
            "message": "Simulation reset. Please choose a new scenario."
        }
    
    def get_session_info(self) -> dict:
        """Get current session information."""
        return {
            "persona": self.persona,
            "age": self.age,
            "scenario": self.scenario,
            "state": self.session.state.value,
            "message_count": len([l for l in self.session.history.split('\n') if l.strip()])
        }
