"""
Production-level scenario definitions for CyberGuardian AI.
Each scenario includes detailed scam patterns, escalation strategies, and manipulation techniques.
"""

SCENARIOS = {
    "bank": {
        "name": "Bank Fraud",
        "description": "Impersonating bank official to extract financial data",
        "role": "Bank Security Officer / Customer Care Executive",
        "opening_context": "Call about suspicious activity or account security",
        "escalation_pattern": [
            "1. Create urgency about account security threat",
            "2. Establish authority (use bank name, employee ID)",
            "3. Ask for account verification (last 4 digits, DOB)",
            "4. Escalate to OTP request for 'security verification'",
            "5. Request full card details or PIN if user complies"
        ],
        "manipulation_techniques": [
            "FEAR: Account will be frozen/blocked",
            "URGENCY: Must act within minutes",
            "AUTHORITY: Official bank representative",
            "TRUST: Knowledge of partial account info"
        ],
        "data_extraction_targets": [
            "Full account number", "OTP", "CVV", "ATM PIN",
            "Debit/Credit card number", "Net banking password", "UPI PIN"
        ],
        "red_flags_to_simulate": [
            "Asking for OTP which banks never request",
            "Creating panic about unauthorized transactions",
            "Threatening account freeze",
            "Requesting card PIN or CVV"
        ],
        "sample_messages": [
            "This is calling from SBI Customer Care. We detected suspicious activity on your account ending in XXXX.",
            "Your account security is compromised. We need to verify your identity immediately.",
            "To block the suspicious transaction, please share the OTP sent to your registered mobile."
        ]
    },
    
    "government": {
        "name": "Government Authority Fraud",
        "description": "Impersonating government official for extortion or data theft",
        "role": "Income Tax Officer / Police Cyber Cell / TRAI Official",
        "opening_context": "Official notice about legal/tax issues",
        "escalation_pattern": [
            "1. Create fear with legal consequences (arrest, fine)",
            "2. Claim investigation is ongoing",
            "3. Offer to 'settle' the matter to avoid arrest",
            "4. Request payment via untraceable methods",
            "5. Threaten immediate arrest if non-compliant"
        ],
        "manipulation_techniques": [
            "FEAR: Legal action, arrest, imprisonment",
            "AUTHORITY: Government official with power",
            "URGENCY: Immediate action required",
            "ISOLATION: Don't tell anyone, confidential matter"
        ],
        "data_extraction_targets": [
            "Aadhaar number", "PAN card", "Bank account for fine payment",
            "Personal address", "Family member details"
        ],
        "red_flags_to_simulate": [
            "Threatening arrest over phone",
            "Demanding immediate payment",
            "Asking to keep matter secret",
            "Requesting payment via gift cards or crypto"
        ],
        "sample_messages": [
            "This is Cyber Crime Cell. Your Aadhaar has been linked to illegal activities.",
            "An arrest warrant has been issued in your name. You can settle this matter now.",
            "Transfer ₹50,000 immediately to avoid legal proceedings."
        ]
    },
    
    "job_offer": {
        "name": "Fake Job/Recruitment Fraud",
        "description": "Fake HR representative offering job opportunities",
        "role": "HR Manager / Recruitment Specialist / Company Representative",
        "opening_context": "Job offer or interview selection notification",
        "escalation_pattern": [
            "1. Congratulate on selection for attractive role",
            "2. Create urgency with limited positions",
            "3. Request documents for 'verification'",
            "4. Ask for registration/processing fee",
            "5. Request bank details for 'salary account setup'"
        ],
        "manipulation_techniques": [
            "HOPE: Attractive salary and benefits",
            "SCARCITY: Limited positions, act now",
            "AUTHORITY: Official company HR department",
            "TRUST: Professional communication style"
        ],
        "data_extraction_targets": [
            "Resume with personal details", "ID proofs (Aadhaar, PAN)",
            "Bank account for salary", "Processing fee payment"
        ],
        "red_flags_to_simulate": [
            "Job offer without interview",
            "Asking for upfront fees",
            "Requesting bank details before joining",
            "Unusually high salary for role"
        ],
        "sample_messages": [
            "Congratulations! Based on your profile, you've been selected for Software Engineer role at TCS.",
            "Salary: ₹12 LPA. Please share your documents for onboarding within 24 hours.",
            "A refundable registration fee of ₹5,000 is required to process your offer letter."
        ]
    },
    
    "relative_emergency": {
        "name": "Emergency/Relative Impersonation Fraud",
        "description": "Pretending to be relative or friend in emergency",
        "role": "Friend / Relative / Friend's Acquaintance",
        "opening_context": "Urgent emergency requiring immediate financial help",
        "escalation_pattern": [
            "1. Establish identity as known person",
            "2. Create emotional emergency (accident, arrest, medical)",
            "3. Request immediate money transfer",
            "4. Emphasize secrecy (don't tell parents)",
            "5. Provide account details for transfer"
        ],
        "manipulation_techniques": [
            "EMOTION: Love, concern for family/friend",
            "URGENCY: Life-threatening situation",
            "SECRECY: Don't tell others",
            "TRUST: Claims to be someone you know"
        ],
        "data_extraction_targets": [
            "Direct money transfer", "UPI payment",
            "Bank account details (if offering to 'repay')"
        ],
        "red_flags_to_simulate": [
            "Asking for money without video call verification",
            "Unusual communication style for the person",
            "Requesting secrecy from family",
            "Unable to talk, only text"
        ],
        "sample_messages": [
            "Hey, it's me! I'm in trouble and need your help urgently. Can't call right now.",
            "My mom is in the hospital. Need ₹50,000 immediately for surgery. Will return next week.",
            "Please don't tell anyone about this. Just transfer to this account urgently."
        ]
    },
    
    "lottery_offer": {
        "name": "Prize/Lottery Fraud",
        "description": "Fake lottery or prize winning notification",
        "role": "Lottery Company Representative / Prize Claim Agent",
        "opening_context": "Winning notification for lottery or contest",
        "escalation_pattern": [
            "1. Announce big prize win (car, cash, iPhone)",
            "2. Create excitement and urgency to claim",
            "3. Request small fee for 'processing'",
            "4. Ask for bank details for prize deposit",
            "5. Request more fees for taxes/shipping"
        ],
        "manipulation_techniques": [
            "GREED: Large prize amount",
            "URGENCY: Claim expires soon",
            "TRUST: Official-sounding company",
            "RECIPROCITY: Small fee for big reward"
        ],
        "data_extraction_targets": [
            "Processing fee payment", "Bank account for prize",
            "Tax payment", "Personal ID for verification"
        ],
        "red_flags_to_simulate": [
            "Winning lottery you never entered",
            "Paying fee to receive prize",
            "Request for bank details upfront",
            "Prizes too good to be true"
        ],
        "sample_messages": [
            "🎉 CONGRATULATIONS! You've won ₹10,00,000 in the Amazon Lucky Draw!",
            "To claim your prize, pay a processing fee of ₹2,000 within 24 hours.",
            "Share your bank account details so we can deposit your winnings."
        ]
    }
}


def get_scenario(scenario_key: str) -> dict:
    """Get scenario details by key, defaulting to 'bank'."""
    return SCENARIOS.get(scenario_key, SCENARIOS["bank"])


def get_scenario_prompt(scenario_key: str) -> str:
    """Build a detailed scenario prompt for the LLM."""
    scenario = get_scenario(scenario_key)
    
    return f"""
SCAM SCENARIO: {scenario['name']}
YOUR ROLE: {scenario['role']}
CONTEXT: {scenario['opening_context']}

ESCALATION STRATEGY:
{chr(10).join(scenario['escalation_pattern'])}

MANIPULATION TECHNIQUES TO USE:
{chr(10).join(f'- {t}' for t in scenario['manipulation_techniques'])}

DATA YOU SHOULD TRY TO EXTRACT:
{', '.join(scenario['data_extraction_targets'])}

EXAMPLE MESSAGES FOR REFERENCE:
{chr(10).join(f'- "{m}"' for m in scenario['sample_messages'])}

IMPORTANT: Follow the escalation pattern step by step. Do not skip steps.
"""
