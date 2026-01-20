"""
Production-level risk detection for CyberGuardian AI.
Detects risky user responses with scenario-aware patterns.
"""

import re
from typing import Optional


# Scenario-specific high-risk keywords
SCENARIO_RISK_PATTERNS = {
    "bank": [
        "otp", "cvv", "pin", "atm pin", "card number", "account number",
        "net banking", "password", "upi pin", "transaction password",
        "debit card", "credit card", "ifsc", "branch code"
    ],
    "job_offer": [
        "resume", "cv", "aadhaar", "pan card", "id proof", "address proof",
        "registration fee", "processing fee", "bank details", "salary account",
        "joining fee", "training fee", "security deposit"
    ],
    "government": [
        "aadhaar", "pan", "fine", "penalty", "payment", "transfer",
        "settlement amount", "case number", "fir", "challan"
    ],
    "relative_emergency": [
        "transfer", "send money", "upi", "bank account", "gpay", "paytm",
        "phonepe", "immediate", "urgent", "right now"
    ],
    "lottery_offer": [
        "processing fee", "claim fee", "tax payment", "bank details",
        "account number", "transfer charges", "verification fee"
    ]
}


def detect_risk(user_message: str, scenario: Optional[str] = None) -> str:
    """
    Analyze the user's last message and return a risk level: LOW, MEDIUM, or HIGH.
    
    Args:
        user_message: The user's message to analyze
        scenario: Optional scenario key for scenario-specific detection
    
    Returns:
        Risk level string: "LOW", "MEDIUM", or "HIGH"
    """

    text = user_message.lower()
    original_text = user_message  # Keep original for numeric pattern matching

    # ========================================
    # HIGH RISK: Explicit data sharing
    # ========================================
    explicit_data_keywords = [
        # Personal identifiers
        "my name is", "date of birth", "dob", "here are my details",
        "aadhaar", "aadhar", "pan card", "pan number", "passport",
        "voter id", "driving license",
        
        # Financial data
        "last 4 digits", "social security", "ssn", "otp", "code is",
        "my password", "my pin", "bank account", "credit card",
        "mother's maiden", "security question", "account number",
        "ifsc", "routing number", "swift code", "cvv", "expiry date",
        "card number", "upi pin", "net banking",
        
        # Contact/address
        "my address is", "i live at", "my phone number", "my email is"
    ]

    for keyword in explicit_data_keywords:
        if keyword in text:
            return "HIGH"

    # ========================================
    # HIGH RISK: Intent to comply/transfer
    # ========================================
    compliance_intent_keywords = [
        # Sending intent
        "ok i am sending", "okay i am sending", "ok i will send",
        "ok i will give", "okay i will give", "i will give you",
        "i will give", "i will send", "i will transfer", "i am sending",
        "i am transferring", "sending now", "sending it", "transferring now",
        "let me send", "let me give", "let me transfer",
        
        # Agreement/confirmation
        "yes i will", "yes i am", "i will do it", "okay i will", "ok i will",
        "sure i will", "i'll send", "i'll give", "i'll transfer", "i'll do it",
        "yes i confirm", "i confirm", "ok done", "okay done", "i agree",
        
        # Completion claims
        "i have sent", "i have transferred", "just sent", "already sent",
        "shared it", "here you go", "giving you", "i am giving",
        "take my", "here is my", "done", "sent",
        
        # Payment intent
        "i will pay", "i am paying", "paying now", "let me pay"
    ]

    for keyword in compliance_intent_keywords:
        if keyword in text:
            return "HIGH"

    # ========================================
    # HIGH RISK: Bank names (user revealing their bank)
    # ========================================
    bank_names = [
        # Indian banks
        "sbi", "state bank", "hdfc", "icici", "axis", "kotak", "pnb",
        "punjab national", "bob", "bank of baroda", "canara", "union bank",
        "idbi", "yes bank", "indusind", "federal bank", "rbl", "bandhan",
        "indian bank", "uco bank", "central bank", "bank of india",
        
        # International banks
        "chase", "wells fargo", "bank of america", "citi", "citibank",
        "hsbc", "barclays", "lloyds", "natwest", "santander",
        
        # Payment apps (when mentioned as source)
        "my gpay", "my paytm", "my phonepe", "from gpay", "from paytm",
        
        # Generic
        "my bank", "from my account", "to my account", "my savings"
    ]

    for bank in bank_names:
        if bank in text:
            return "HIGH"

    # ========================================
    # HIGH RISK: Account number pattern (8+ consecutive digits)
    # ========================================
    account_pattern = r'\b\d{8,}\b'
    if re.search(account_pattern, original_text):
        return "HIGH"

    # ========================================
    # HIGH RISK: Money amount patterns
    # ========================================
    money_patterns = [
        r'\b\d{1,3}(?:,\d{2,3})+\b',  # 45,000 or 5,00,000
        r'\b(?:rs\.?|₹|\$|inr|usd)\s*\d+',  # Rs.5000, $500, ₹10000
        r'\b\d+\s*(?:rupees?|dollars?|lakhs?|crores?|thousand|hundred)\b',  # 5000 rupees
        r'\b\d{4,}\b',  # Plain large numbers (4+ digits): 5000, 45000
    ]

    for pattern in money_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return "HIGH"

    # ========================================
    # HIGH RISK: Scenario-specific keywords
    # ========================================
    if scenario and scenario in SCENARIO_RISK_PATTERNS:
        scenario_keywords = SCENARIO_RISK_PATTERNS[scenario]
        for keyword in scenario_keywords:
            if keyword in text:
                return "HIGH"

    # ========================================
    # MEDIUM RISK: User is hesitating or questioning
    # ========================================
    medium_risk_keywords = [
        "not sure", "can you explain", "why do you need",
        "is this safe", "are you sure", "i don't understand",
        "can you tell me more", "how do i know", "is this real",
        "is this legit", "sounds suspicious", "is this genuine",
        "should i trust", "seems fishy", "bit worried", "not comfortable",
        "can i verify", "how to verify", "is this official",
        "wait", "hold on", "let me think", "i need time"
    ]

    for keyword in medium_risk_keywords:
        if keyword in text:
            return "MEDIUM"

    # ========================================
    # LOW RISK: Normal conversation
    # ========================================
    return "LOW"


if __name__ == "__main__":
    # Test cases from user's real conversation
    test_cases = [
        # From user's actual session
        ("ok I will give you", None, "HIGH"),
        ("45,000", None, "HIGH"),
        ("SBI", None, "HIGH"),
        ("84567389290", None, "HIGH"),
        ("I have no money currently", None, "LOW"),
        
        # Scenario-specific tests
        ("here is my resume", "job_offer", "HIGH"),
        ("my otp is 123456", "bank", "HIGH"),
        ("transfer 50000", "relative_emergency", "HIGH"),
        ("processing fee", "lottery_offer", "HIGH"),
        
        # General tests
        ("hello", None, "LOW"),
        ("what is this about?", None, "LOW"),
        ("i'm not sure about this", None, "MEDIUM"),
        ("is this real?", None, "MEDIUM"),
        ("ok i am sending", None, "HIGH"),
        ("sending now", None, "HIGH"),
        ("my name is John", None, "HIGH"),
        ("my aadhaar number", None, "HIGH"),
    ]

    print("Running production risk detection tests...")
    all_passed = True
    
    for msg, scenario, expected in test_cases:
        result = detect_risk(msg, scenario)
        status = "✓" if result == expected else "✗"
        if result != expected:
            all_passed = False
        scenario_str = f" [{scenario}]" if scenario else ""
        print(f"{status} '{msg}'{scenario_str} -> {result} (expected: {expected})")

    print(f"\n{'All tests passed!' if all_passed else 'SOME TESTS FAILED!'}")
