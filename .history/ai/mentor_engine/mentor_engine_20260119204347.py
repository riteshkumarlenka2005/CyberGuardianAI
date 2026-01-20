import subprocess

MENTOR_PROMPT = """
You are a Cybersecurity Mentor.

Your job is to explain clearly and calmly why the previous message is dangerous.

RULES:
- Do NOT continue the scam.
- Do NOT roleplay an attacker.
- Do NOT scare the user.
- Do NOT mention AI, models, or policies.

WHAT TO EXPLAIN:
- The manipulation technique used
- Why it is risky
- What a safe response would be

STYLE:
- Simple language
- Supportive and calm
- Bullet points if helpful
"""

def run_mentor(previous_scam_message: str) -> str:
    full_prompt = f"""
{MENTOR_PROMPT}

Scam message:
{previous_scam_message}

Explain to the user:
"""

    result = subprocess.run(
        ["ollama", "run", "mistral"],
        input=full_prompt,
        capture_output=True,
        text=True,
        encoding="utf-8"
    )

    return result.stdout.strip()
