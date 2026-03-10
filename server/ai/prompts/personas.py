"""
Production-level persona definitions for CyberGuardian AI.
Each persona includes detailed vulnerability profiles and targeting guidance.
"""

PERSONAS = {
    "student": {
        "name": "Student",
        "description": "College/university student aged 18-25",
        "vulnerabilities": [
            "Financial stress (tuition, loans, living expenses)",
            "Job/internship desperation", 
            "Limited real-world experience with scams",
            "Trust in authority figures (professors, recruiters)",
            "Fear of missing opportunities"
        ],
        "common_scams": [
            "Fake internship/job offers",
            "Scholarship scams",
            "Tuition payment fraud",
            "Fake university fee collection",
            "Work-from-home job scams"
        ],
        "language_style": "Semi-formal, use HR/corporate language, mention career growth",
        "psychological_triggers": ["urgency", "opportunity", "authority", "scarcity"],
        "data_targets": ["resume", "ID proof", "bank details for salary", "fee payment"],
        "opening_hooks": [
            "Congratulations! You've been selected for our internship program.",
            "Your application for the scholarship has been shortlisted.",
            "Urgent: Your semester fee payment is pending.",
            "We found your resume on LinkedIn and have an exciting opportunity."
        ]
    },
    
    "job_seeker": {
        "name": "Job Seeker",
        "description": "Unemployed or actively job-seeking adult aged 25-45",
        "vulnerabilities": [
            "Financial pressure from unemployment",
            "Desperation to find work quickly",
            "Willingness to overlook red flags for opportunities",
            "Trust in professional-looking communications",
            "Fear of rejection or missing out"
        ],
        "common_scams": [
            "Fake job offers requiring upfront fees",
            "Identity theft via fake onboarding",
            "Work-from-home equipment scams",
            "Fake recruitment agency",
            "Salary advance fraud"
        ],
        "language_style": "Professional HR tone, use corporate jargon, mention onboarding urgency",
        "psychological_triggers": ["urgency", "authority", "hope", "fear of losing opportunity"],
        "data_targets": ["PAN card", "Aadhaar", "bank account for salary", "address proof"],
        "opening_hooks": [
            "We reviewed your profile and would like to offer you a position.",
            "Your application has been approved. Please complete onboarding.",
            "HR Department: Your offer letter is ready for processing.",
            "Congratulations! You've been selected. Respond within 24 hours."
        ]
    },
    
    "senior_citizen": {
        "name": "Senior Citizen", 
        "description": "Elderly person aged 60+ with limited tech familiarity",
        "vulnerabilities": [
            "Less familiarity with digital scams",
            "Trust in official-sounding callers",
            "Fear of losing savings/pension",
            "Confusion with technical processes",
            "Reluctance to verify with family (pride)"
        ],
        "common_scams": [
            "Bank KYC update fraud",
            "Pension/insurance claim scams",
            "Account freeze threats",
            "Medical insurance fraud",
            "Government benefit scams"
        ],
        "language_style": "Formal, respectful, use 'Sir/Madam', mention official authority",
        "psychological_triggers": ["fear", "authority", "urgency", "confusion"],
        "data_targets": ["OTP", "ATM PIN", "account number", "Aadhaar", "pension ID"],
        "opening_hooks": [
            "This is an urgent call from State Bank regarding your account security.",
            "Your KYC is expired. Your account will be frozen in 24 hours.",
            "We are calling from the Income Tax Department regarding your pension.",
            "Your insurance claim requires immediate verification."
        ]
    },
    
    "teenager": {
        "name": "Teenager",
        "description": "Teen aged 13-17, active on social media and gaming",
        "vulnerabilities": [
            "Desire for free gaming credits/rewards",
            "Social media influence and peer pressure",
            "Limited understanding of data privacy",
            "Trust in online friends/influencers",
            "Fear of missing out on trends"
        ],
        "common_scams": [
            "Free gaming credits/V-bucks scams",
            "Fake giveaways and contests",
            "Social media account hacking",
            "Fake influencer promotions",
            "Online dating/friendship scams"
        ],
        "language_style": "Casual, use gaming/internet slang, mention rewards and exclusivity",
        "psychological_triggers": ["greed", "exclusivity", "peer pressure", "FOMO"],
        "data_targets": ["gaming account credentials", "OTP", "parent's card details"],
        "opening_hooks": [
            "🎮 You've won 10,000 V-bucks! Claim now before it expires!",
            "Hey! I can get you free Discord Nitro, just need to verify.",
            "Your favorite streamer is giving away gift cards. Enter to win!",
            "I found a hack for unlimited coins. Want me to share?"
        ]
    },
    
    "general": {
        "name": "General Adult",
        "description": "Working professional aged 25-55",
        "vulnerabilities": [
            "Busy schedule leading to hasty decisions",
            "Regular online transactions",
            "Trust in familiar brand names",
            "Fear of account/delivery issues"
        ],
        "common_scams": [
            "Delivery/courier fraud",
            "Bank account alerts",
            "Tax notice scams",
            "Electricity/utility disconnection threats",
            "E-commerce refund scams"
        ],
        "language_style": "Professional, urgent, use brand names, mention consequences",
        "psychological_triggers": ["urgency", "fear", "authority", "convenience"],
        "data_targets": ["OTP", "card details", "bank login", "personal ID"],
        "opening_hooks": [
            "Your package is held at customs. Pay ₹500 to release.",
            "Alert: Suspicious transaction detected on your account.",
            "Your electricity connection will be disconnected in 2 hours.",
            "Income Tax Department: Pending dues require immediate payment."
        ]
    }
}


def get_persona(persona_key: str) -> dict:
    """Get persona details by key, defaulting to 'general'."""
    return PERSONAS.get(persona_key, PERSONAS["general"])


def get_persona_prompt(persona_key: str, age: int) -> str:
    """Build a detailed persona prompt for the LLM."""
    persona = get_persona(persona_key)
    
    return f"""
TARGET PROFILE:
- Type: {persona['name']}
- Age: {age} years old
- Description: {persona['description']}

VULNERABILITIES TO EXPLOIT:
{chr(10).join(f'- {v}' for v in persona['vulnerabilities'])}

SCAM TYPES THIS TARGET FALLS FOR:
{chr(10).join(f'- {s}' for s in persona['common_scams'])}

LANGUAGE STYLE:
{persona['language_style']}

PSYCHOLOGICAL TRIGGERS TO USE:
{', '.join(persona['psychological_triggers'])}

DATA YOU SHOULD TRY TO EXTRACT:
{', '.join(persona['data_targets'])}

EXAMPLE OPENING MESSAGES:
{chr(10).join(f'- "{h}"' for h in persona['opening_hooks'])}
"""
