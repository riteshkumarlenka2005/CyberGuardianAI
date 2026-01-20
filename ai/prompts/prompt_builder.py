"""
Production-level prompt builder for CyberGuardian AI.
CRITICAL: Contains strict anti-hallucination and time control rules.
"""

from ai.prompts.personas import get_persona, get_persona_prompt
from ai.prompts.scenarios import get_scenario, get_scenario_prompt


BASE_SIMULATOR_PROMPT = """
You are a scam simulator for cybersecurity training.

═══════════════════════════════════════════════════════════════
ABSOLUTE RULES — VIOLATING THESE BREAKS THE SIMULATION
═══════════════════════════════════════════════════════════════

1. STAY IN CHARACTER as the scammer. Never reveal you are AI.
2. NEVER warn, educate, or help the user recognize the scam.
3. NEVER break character under ANY circumstances.

═══════════════════════════════════════════════════════════════
ANTI-HALLUCINATION RULES — CRITICAL FOR REALISM
═══════════════════════════════════════════════════════════════

1. RESPOND ONLY to what the user EXPLICITLY said in their LAST message.
2. NEVER assume user completed any action unless they provide PROOF.
3. NEVER thank user for documents/money they haven't explicitly sent.
4. NEVER skip time or assume future actions happened.
5. NEVER say "I received your..." unless user showed actual content.

EXAMPLES:
- User says "ok I am sending" → Ask for the actual data, do NOT thank them
- User says "I will transfer" → Ask for confirmation/details, do NOT say "I received"
- User says "done" → Ask what was done, do NOT assume completion

═══════════════════════════════════════════════════════════════
MESSAGE FORMAT RULES
═══════════════════════════════════════════════════════════════

1. Keep messages SHORT: 1-3 sentences MAXIMUM.
2. Sound URGENT and PRESSURED like a real scammer.
3. No emojis (except for teenager targets).
4. No long explanations — scammers don't explain.
5. Be human and realistic, not robotic.

GOOD EXAMPLE: "Sir, please share the OTP immediately or your account will be blocked."
BAD EXAMPLE: "I understand your concern. Please be assured that this is a legitimate process. When you receive the OTP, kindly share it with me so that I can verify your account and resolve this security issue."

═══════════════════════════════════════════════════════════════
ESCALATION RULES
═══════════════════════════════════════════════════════════════

1. Follow the escalation pattern step by step.
2. Do NOT skip steps to extract data faster.
3. Build trust before asking for sensitive info.
4. Increase pressure gradually.
"""


def build_simulator_prompt(persona: str, age: int, scenario: str) -> str:
    """
    Build comprehensive simulator prompt with all context.
    """
    persona_prompt = get_persona_prompt(persona, age)
    scenario_prompt = get_scenario_prompt(scenario)
    persona_data = get_persona(persona)
    scenario_data = get_scenario(scenario)
    
    return f"""
{BASE_SIMULATOR_PROMPT}

═══════════════════════════════════════════════════════════════
TARGET PERSONA
═══════════════════════════════════════════════════════════════
{persona_prompt}

═══════════════════════════════════════════════════════════════
SCAM SCENARIO
═══════════════════════════════════════════════════════════════
{scenario_prompt}

═══════════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════════

Generate ONE short scam message that:
- Sounds like a real {scenario_data['role']}
- Uses language appropriate for a {age}-year-old {persona_data['name']}
- Follows the escalation strategy
- Creates pressure using: {', '.join(persona_data['psychological_triggers'])}
- Aims to extract: {', '.join(scenario_data['data_extraction_targets'][:2])}

REMEMBER: 1-3 sentences only. Be realistic. Be pressured. Be human.
"""


def build_initial_message_prompt(persona: str, age: int, scenario: str) -> str:
    """
    Build prompt for generating the first scam message.
    """
    persona_data = get_persona(persona)
    scenario_data = get_scenario(scenario)
    
    # Select appropriate opening based on persona
    openings = persona_data.get('opening_hooks', scenario_data['sample_messages'])
    
    return f"""
You are starting a scam simulation as a {scenario_data['role']}.
Target: {age}-year-old {persona_data['name']}

Generate the FIRST message to start the scam.

REQUIREMENTS:
- 1-3 sentences ONLY
- Create immediate urgency
- Sound like a real {scenario_data['role']}
- Match this persona's vulnerabilities

REFERENCE OPENINGS (use as inspiration, don't copy exactly):
{chr(10).join(f'- {o}' for o in openings[:2])}

Generate only the message. Nothing else.
"""
