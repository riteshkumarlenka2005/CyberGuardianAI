from ai.llm.ollama_client import call_ollama

MENTOR_PROMPT = """
You are a Cybersecurity Mentor.

Your job is to explain clearly and calmly why the user's response is dangerous.

RULES:
- Do NOT continue the scam.
- Do NOT roleplay an attacker.
- Do NOT scare the user.
- Do NOT mention AI, models, or policies.

WHAT TO EXPLAIN:
- The manipulation technique used by the scammer
- Why the user's response is risky
- What a safe response would be

STYLE:
- Simple language
- Supportive and calm
- Bullet points if helpful
"""


def run_mentor(last_scammer_message: str, user_risky_reply: str = "") -> str:
    """
    Generate mentor explanation based on the scam context.
    
    Args:
        last_scammer_message: The scammer's message that prompted the user's response
        user_risky_reply: The user's risky reply that triggered mentor intervention
    """
    context = f"Last scammer message: {last_scammer_message}"
    if user_risky_reply:
        context += f"\nUser's risky reply: {user_risky_reply}"
    
    full_prompt = f"""
{MENTOR_PROMPT}

{context}

Explain to the user why their response is risky and what they should do instead:
"""

    return call_ollama(full_prompt)
