from enum import Enum


class SimulationState(str, Enum):
    SETUP = "SETUP"
    SIMULATING = "SIMULATING"
    MENTOR = "MENTOR"
    ENDED = "ENDED"


class SimulationSession:
    def __init__(self, persona: str, age: int, scenario: str):
        self.persona = persona
        self.age = age
        self.scenario = scenario
        self.state = SimulationState.SIMULATING
        self.history = ""

    def add_message(self, role: str, message: str):
        self.history += f"\n{role}: {message}"

    def pause_for_mentor(self):
        self.state = SimulationState.MENTOR

    def resume_simulation(self):
        self.state = SimulationState.SIMULATING

    def reset(self):
        self.state = SimulationState.ENDED
        self.history = ""
