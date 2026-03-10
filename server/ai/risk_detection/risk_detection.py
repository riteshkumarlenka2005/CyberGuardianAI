"""
Universal Risk Detection Engine for CyberGuardian AI.
Detects ANY risky user response using pattern matching and semantic analysis.

CRITICAL: Backend code enforces mentoring, NOT the LLM.
"""

import re
from typing import Optional, Tuple


# ================================================
# UNIVERSAL RISK PATTERNS (NOT scenario-specific)
# ================================================

# Intent patterns using regex for flexible matching
COMPLIANCE_INTENT_PATTERNS = [
    # Agreement patterns
    r'\b(ok|okay|yes|sure|fine|alright|agreed|ya|yea|yeah)\b.*\b(i will|i am|i\'ll|let me|sending|give|transfer|pay|share)',
    r'\b(i will|i am|i\'ll|let me)\b.*\b(send|give|transfer|pay|share|provide|do it)',
    r'\b(sending|giving|transferring|paying|sharing)\b.*\b(now|it|you|this|that)',
    r'\bhere\s*(you\s*go|it\s*is|is\s*my|are\s*my)',
    r'\btake\s*(my|this|it)',
    r'\b(done|sent|shared|transferred|paid|given)\b',
    
    # Confirmation patterns
    r'\b(yes|ok|okay|sure)\s*(i\s*)?(confirm|agree|accept|understand)',
    r'\bi\s*(confirm|agree|accept)',
    r'\b(confirmed|agreed|accepted)\b',
]

# Data sharing patterns
DATA_SHARING_PATTERNS = [
    # Personal identifiers - flexible matching
    r'\b(my|the)\s*(name|full\s*name)\s*(is|:)',
    r'\b(dob|date\s*of\s*birth|birthday)\b',
    r'\b(aadhaar|aadhar|adhaar)\b',
    r'\b(pan\s*(card|number)?|pancard)\b',
    r'\b(passport|voter\s*id|driving\s*licen[cs]e)\b',
    r'\bssn|social\s*security\b',
    
    # Financial data - flexible matching
    r'\b(otp|one\s*time\s*password)\b',
    r'\b(cvv|cvc|security\s*code)\b',
    r'\b(pin|atm\s*pin|upi\s*pin)\b',
    r'\b(account\s*(number|no|#)?|a/c\s*(no|number)?)\b',
    r'\b(card\s*(number|no|#)?|credit\s*card|debit\s*card)\b',
    r'\b(ifsc|routing\s*number|swift)\b',
    r'\b(password|pwd|passcode)\b',
    r'\bexpiry|valid\s*(till|thru|through)\b',
    
    # Contact/address
    r'\b(my|the)\s*(address|phone|mobile|email)\s*(is|:)',
    r'\bi\s*live\s*(at|in)\b',
]

# Numeric patterns indicating sensitive data
SENSITIVE_NUMERIC_PATTERNS = [
    r'\b\d{8,}\b',  # Account numbers (8+ digits)
    r'\b\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\b',  # Card numbers
    r'\b\d{3,4}\s*\d{4}\s*\d{4}\b',  # Aadhaar-like
    r'\b\d{4,6}\b(?=.*\b(otp|code|pin)\b)',  # OTP/PIN context
    r'\b[A-Z]{5}\d{4}[A-Z]\b',  # PAN format
]

# Money patterns
MONEY_PATTERNS = [
    r'\b\d{1,3}(?:,\d{2,3})+\b',  # Indian format: 45,000 or 5,00,000
    r'(?:rs\.?|₹|\$|inr|usd)\s*\d+',  # Currency symbols
    r'\b\d+\s*(?:rupees?|dollars?|lakhs?|lac|crores?|thousand|k|hundred)\b',
    r'\b\d{4,}\b',  # Large numbers (4+ digits)
]

# Bank and payment identifiers
FINANCIAL_IDENTIFIERS = [
    # Indian banks
    r'\b(sbi|hdfc|icici|axis|kotak|pnb|bob|idbi|canara|union\s*bank)\b',
    r'\b(state\s*bank|punjab\s*national|bank\s*of\s*(baroda|india))\b',
    r'\b(yes\s*bank|indusind|federal\s*bank|rbl|bandhan)\b',
    
    # International banks
    r'\b(chase|wells\s*fargo|citi|citibank|hsbc|barclays)\b',
    r'\bbank\s*of\s*america\b',
    
    # Payment apps
    r'\b(gpay|google\s*pay|paytm|phonepe|bhim|upi)\b',
    r'\b(paypal|venmo|cash\s*app)\b',
    
    # Generic
    r'\b(my|from\s*my|to\s*my)\s*(bank|account|savings)\b',
]

# Hesitation patterns (MEDIUM risk)
HESITATION_PATTERNS = [
    r'\b(not\s*sure|unsure|confused|don\'t\s*understand)\b',
    r'\b(is\s*this|are\s*you)\s*(safe|real|legit|genuine|official|true)\b',
    r'\b(can\s*you|could\s*you)\s*(explain|verify|prove|confirm)\b',
    r'\b(why|how)\s*(do\s*you|should\s*i)\s*(need|trust|believe)\b',
    r'\b(sounds?|seems?|looks?)\s*(suspicious|fishy|fake|odd|strange|weird)\b',
    r'\b(wait|hold\s*on|let\s*me\s*think|give\s*me\s*time)\b',
    r'\b(bit|little|somewhat)\s*(worried|concerned|hesitant)\b',
    r'\bhow\s*(do|can)\s*i\s*(know|verify|check|confirm)\b',
]


def _check_patterns(text: str, patterns: list) -> bool:
    """Check if any pattern matches the text."""
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def _detect_implicit_compliance(text: str) -> bool:
    """
    Detect implicit compliance even without explicit keywords.
    Use semantic patterns to catch phrases like:
    - "ok" followed by any positive action
    - Short affirmative responses in risky context
    """
    text_lower = text.lower().strip()
    
    # Very short affirmative responses (1-3 words) that indicate compliance
    short_affirmatives = [
        r'^(ok|okay|yes|sure|fine|alright|done|sent|ya|yea|yeah)\.?$',
        r'^(ok|okay|yes|sure)\s+(sir|ma\'?am|boss|bro|ji)\.?$',
        r'^(i\s*will|i\'ll|let\s*me|sending|ok\s*wait)\.?$',
    ]
    
    for pattern in short_affirmatives:
        if re.match(pattern, text_lower):
            return True
    
    return False


def detect_risk(user_message: str, scenario: Optional[str] = None) -> str:
    """
    Universal risk detection engine.
    
    Returns: "LOW", "MEDIUM", or "HIGH"
    
    CRITICAL: This function MUST be called BEFORE any LLM call.
    If this returns "HIGH", the LLM must NOT be called.
    """
    
    text = user_message.strip()
    text_lower = text.lower()
    
    # Empty or very short non-risky messages
    if len(text) < 2:
        return "LOW"
    
    # ================================================
    # HIGH RISK CHECKS (in order of priority)
    # ================================================
    
    # 1. Explicit data sharing patterns
    if _check_patterns(text_lower, DATA_SHARING_PATTERNS):
        return "HIGH"
    
    # 2. Sensitive numeric data
    if _check_patterns(text, SENSITIVE_NUMERIC_PATTERNS):
        return "HIGH"
    
    # 3. Money amounts
    if _check_patterns(text_lower, MONEY_PATTERNS):
        return "HIGH"
    
    # 4. Financial identifiers (bank names, payment apps)
    if _check_patterns(text_lower, FINANCIAL_IDENTIFIERS):
        return "HIGH"
    
    # 5. Compliance intent patterns
    if _check_patterns(text_lower, COMPLIANCE_INTENT_PATTERNS):
        return "HIGH"
    
    # 6. Implicit compliance (short affirmatives)
    if _detect_implicit_compliance(text):
        return "HIGH"
    
    # 7. Contains what looks like actual sensitive data
    # Raw numbers that could be account/card/OTP
    if re.search(r'\b\d{6,}\b', text):  # 6+ digit numbers
        return "HIGH"
    
    # ================================================
    # MEDIUM RISK CHECKS
    # ================================================
    
    if _check_patterns(text_lower, HESITATION_PATTERNS):
        return "MEDIUM"
    
    # ================================================
    # LOW RISK (default)
    # ================================================
    
    return "LOW"


def get_risk_explanation(user_message: str, risk_level: str) -> Tuple[str, list]:
    """
    Get explanation of why message was flagged.
    Returns (category, matched_patterns)
    """
    text = user_message.lower()
    
    checks = [
        ("Data Sharing", DATA_SHARING_PATTERNS),
        ("Compliance Intent", COMPLIANCE_INTENT_PATTERNS),
        ("Financial Info", FINANCIAL_IDENTIFIERS),
        ("Money Amount", MONEY_PATTERNS),
        ("Sensitive Number", SENSITIVE_NUMERIC_PATTERNS),
        ("Hesitation", HESITATION_PATTERNS),
    ]
    
    for category, patterns in checks:
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return category, [match.group()]
    
    if _detect_implicit_compliance(user_message):
        return "Implicit Compliance", [user_message.strip()]
    
    return "General", []


# ================================================
# TEST SUITE
# ================================================

if __name__ == "__main__":
    test_cases = [
        # From user's actual conversation
        ("ok I will give you", "HIGH"),
        ("45,000", "HIGH"),
        ("SBI", "HIGH"),
        ("84567389290", "HIGH"),
        ("I have no money currently", "LOW"),
        
        # Short affirmatives (implicit compliance)
        ("ok", "HIGH"),
        ("yes", "HIGH"),
        ("done", "HIGH"),
        ("sent", "HIGH"),
        ("ok sir", "HIGH"),
        ("yes ji", "HIGH"),
        
        # Compliance intent
        ("ok i am sending", "HIGH"),
        ("i will send it", "HIGH"),
        ("let me transfer", "HIGH"),
        ("sure i will do it", "HIGH"),
        ("here you go", "HIGH"),
        ("take my details", "HIGH"),
        
        # Data sharing
        ("my name is John", "HIGH"),
        ("my aadhaar number", "HIGH"),
        ("the otp is 123456", "HIGH"),
        ("my pan card", "HIGH"),
        ("account number", "HIGH"),
        
        # Financial
        ("from my gpay", "HIGH"),
        ("hdfc bank", "HIGH"),
        ("5000 rupees", "HIGH"),
        ("Rs.10000", "HIGH"),
        
        # Hesitation (MEDIUM)
        ("is this safe?", "MEDIUM"),
        ("not sure about this", "MEDIUM"),
        ("sounds suspicious", "MEDIUM"),
        ("how do i know this is real", "MEDIUM"),
        
        # Low risk
        ("hello", "LOW"),
        ("what is this about?", "LOW"),
        ("tell me more", "LOW"),
        ("who are you?", "LOW"),
        ("I don't have any documents", "LOW"),
    ]

    print("=" * 60)
    print("UNIVERSAL RISK DETECTION ENGINE - TEST SUITE")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for msg, expected in test_cases:
        result = detect_risk(msg)
        status = "✓" if result == expected else "✗"
        
        if result == expected:
            passed += 1
        else:
            failed += 1
            
        print(f"{status} '{msg}' -> {result} (expected: {expected})")
    
    print("=" * 60)
    print(f"PASSED: {passed}/{len(test_cases)} | FAILED: {failed}/{len(test_cases)}")
    print("=" * 60)
