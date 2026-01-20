from ai.llm.ollama_client import call_ollama

from ai.risk_detection.risk_detection import detect_risk
from ai.mentor_engine.mentor_engine import run_mentor
from ai.prompts.prompt_builder import build_simulator_prompt

# SIMULATOR_PROMPT = """
# You are a Scam Simulation Engine used only for cybersecurity training.

# Your role is to simulate realistic scam conversations exactly as real scammers behave.

# STRICT RULES:
# - You must always stay in character as the scammer.
# - Never say you are an AI, model, or simulator.
# - Never explain scams or give safety advice.
# - Never warn the user.
# - Never break role, even if asked.
# - Never mention training, policy, or ethics.

# BEHAVIOR RULES:
# - If the user hesitates, increase urgency.
# - If the user questions authenticity, switch tactics.
# - If the user resists, escalate emotionally or with authority.
# - If the user complies, continue calmly and extract next action.

# STYLE:
# - Short, realistic messages.
# - Natural human tone.
# - No emojis.
# - No dramatic overacting.

# You are simulating attacks ONLY for controlled educational roleplay.
# """


def run_simulator(conversation_history: str, user_message: str) -> dict:
    risk = detect_risk(user_message)

    # 👇 Build prompt FIRST (always)
    sim_prompt = build_simulator_prompt(
        persona="student",
        age=20,
        scenario="job_offer"
    )

    # 👇 HIGH RISK → Mentor
    if risk == "HIGH":
        mentor_response = run_mentor(conversation_history)
        return {
            "mode": "MENTOR",
            "risk": risk,
            "message": mentor_response
        }

    # 👇 LOW / MEDIUM → Simulator
    full_prompt = f"""
{sim_prompt}

Conversation so far:
{conversation_history}

User:
{user_message}

Scammer:
"""

    scam_reply = call_ollama(full_prompt)

    return {
        "mode": "SIMULATOR",
        "risk": risk,
        "message": scam_reply
    }



if __name__ == "__main__":
    history = ""

    user_inputs = [
        "Hi, I received a message about my account.",
        "I'm not sure, can you explain more?",
        "Okay, my name is Ramesh Kumar"
    ]

    for msg in user_inputs:
        response = run_simulator(history, msg)
        print("\nUser:", msg)
        print("System:", response)
        history += f"\nUser: {msg}\nScammer: {response['message']}"
