"""
Production-level mentor engine for CyberGuardian AI.
Provides persona-aware, contextual explanations when user shows risky behavior.
"""

from ai.llm.ollama_client import call_ollama
from ai.prompts.personas import get_persona
from ai.prompts.scenarios import get_scenario


def build_mentor_prompt(persona: str, age: int, scenario: str) -> str:
    """Build the base mentor prompt with persona context."""
    
    persona_data = get_persona(persona)
    scenario_data = get_scenario(scenario)
    
    return f"""
You are a Cybersecurity Mentor for CyberGuardian AI training platform.

=== YOUR ROLE ===
Explain clearly and calmly why the user's response was risky.
Help them understand the scam tactics being used against them.

=== TARGET CONTEXT ===
- User Profile: {age}-year-old {persona_data['name']}
- Scam Type: {scenario_data['name']}
- Scammer's Role: {scenario_data['role']}

=== WHAT TO EXPLAIN ===

1. **What manipulation technique was used?**
   The scammer in this scenario typically uses:
   {chr(10).join(f'   - {t}' for t in scenario_data['manipulation_techniques'])}

2. **Why is the user's response risky?**
   - What data could be stolen
   - What could happen next if they continued
   - Real-world consequences

3. **What should a safe response look like?**
   - How to verify legitimacy
   - What questions to ask
   - When to hang up or stop responding

=== RED FLAGS IN THIS SCAM TYPE ===
{chr(10).join(f'- {r}' for r in scenario_data['red_flags_to_simulate'])}

=== COMMUNICATION STYLE ===
- Simple, clear language suitable for a {age}-year-old
- Supportive and calm, NOT scary or condescending
- Use bullet points for clarity
- Give specific, actionable advice
- Reference the specific scam type ({scenario_data['name']})

=== RULES ===
- Do NOT continue the scam or roleplay attacker
- Do NOT scare the user excessively
- Do NOT mention AI, models, or system internals
- DO explain how this scam specifically targets {persona_data['name']}s
- DO give practical tips for real-world protection
"""


def run_mentor(
    last_scammer_message: str,
    user_risky_reply: str = "",
    persona: str = "general",
    age: int = 30,
    scenario: str = "bank"
) -> str:
    """
    Generate a persona-aware mentor explanation.
    
    Args:
        last_scammer_message: The scammer's message that prompted the user's response
        user_risky_reply: The user's risky reply that triggered intervention
        persona: User's persona key
        age: User's age
        scenario: Current scam scenario key
    
    Returns:
        Mentor explanation tailored to the user's context
    """
    mentor_base = build_mentor_prompt(persona, age, scenario)
    
    persona_data = get_persona(persona)
    scenario_data = get_scenario(scenario)
    
    context = f"""
=== CONVERSATION CONTEXT ===

Scammer ({scenario_data['role']}) said:
"{last_scammer_message}"

User ({persona_data['name']}, age {age}) replied:
"{user_risky_reply}"

=== YOUR TASK ===

Explain to this {age}-year-old {persona_data['name']}:
1. What manipulation tactic the scammer just used
2. Why their response "{user_risky_reply}" is dangerous
3. What a safer response would be
4. How to verify if such messages are real in the future

Be specific to this {scenario_data['name']} scam and this user's profile.
"""
    
    full_prompt = f"{mentor_base}\n{context}"
    
    return call_ollama(full_prompt)


def get_quick_tip(persona: str, scenario: str) -> str:
    """Get a quick contextual safety tip."""
    
    tips = {
        ("student", "job_offer"): "Real companies never ask for money before hiring. Always verify job offers on the official company website.",
        ("student", "bank"): "Banks never ask for OTP or PIN over call. If unsure, hang up and call your bank's official number.",
        ("senior_citizen", "bank"): "Never share OTP with anyone claiming to be from bank. Banks have all your details already.",
        ("senior_citizen", "government"): "Government never threatens arrest over phone or demands immediate payment.",
        ("job_seeker", "job_offer"): "Legitimate HR never asks for registration fees. Research the company and verify through official channels.",
        ("teenager", "lottery_offer"): "You can't win a lottery you never entered. Free rewards that ask for your details are scams.",
        ("general", "bank"): "When in doubt, hang up and call your bank's official customer care number directly.",
    }
    
    return tips.get((persona, scenario), 
        "When something feels urgent and asks for personal data, pause and verify through official channels.")
