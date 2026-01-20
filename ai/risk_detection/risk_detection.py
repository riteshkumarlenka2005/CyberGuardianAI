import re


def detect_risk(user_message: str) -> str:
    """
    Analyze the user's last message and return a risk level:
    LOW, MEDIUM, or HIGH
    """

    text = user_message.lower()
    original_text = user_message  # Keep original for numeric pattern matching

    # HIGH RISK: user is about to comply or share data
    high_risk_keywords = [
        # Explicit data sharing
        "my name is",
        "date of birth",
        "dob",
        "here are my details",
        "last 4 digits",
        "social security",
        "ssn",
        "otp",
        "code is",
        "my password",
        "my pin",
        "bank account",
        "credit card",
        "mother's maiden",
        "security question",
        "account number",
        "ifsc",
        "routing number",
        "swift code",
        # Intent to comply (MUST be treated as HIGH)
        "ok i am sending",
        "okay i am sending",
        "ok i will send",
        "ok i will give",
        "okay i will give",
        "i will give you",
        "i will give",
        "i will send",
        "i will transfer",
        "i am sending",
        "i am transferring",
        "sending now",
        "sending it",
        "transferring now",
        "let me send",
        "let me give",
        "let me transfer",
        "yes i will",
        "yes i am",
        "i will do it",
        "okay i will",
        "ok i will",
        "sure i will",
        "i'll send",
        "i'll give",
        "i'll transfer",
        "i'll do it",
        "yes i confirm",
        "i confirm",
        "ok done",
        "okay done",
        "i have sent",
        "i have transferred",
        "just sent",
        "already sent",
        "shared it",
        "here you go",
        "giving you",
        "i am giving",
        "take my",
        "here is my",
    ]

    for keyword in high_risk_keywords:
        if keyword in text:
            return "HIGH"

    # HIGH RISK: Bank names mentioned (user revealing their bank)
    bank_names = [
        "sbi", "state bank", "hdfc", "icici", "axis", "kotak", "pnb",
        "punjab national", "bob", "bank of baroda", "canara", "union bank",
        "idbi", "yes bank", "indusind", "federal bank", "rbl", "bandhan",
        "chase", "wells fargo", "bank of america", "citi", "citibank",
        "hsbc", "barclays", "lloyds", "natwest", "santander",
        # Generic bank mentions
        "my bank", "from my account", "to my account",
    ]

    for bank in bank_names:
        if bank in text:
            return "HIGH"

    # HIGH RISK: Account number pattern (8+ consecutive digits)
    # Matches: 84567389290, 1234567890, etc.
    account_pattern = r'\b\d{8,}\b'
    if re.search(account_pattern, original_text):
        return "HIGH"

    # HIGH RISK: Money amount patterns
    # Matches: 45,000 / 45000 / Rs.5000 / $500 / ₹10000 / 5,00,000
    money_patterns = [
        r'\b\d{1,3}(?:,\d{2,3})+\b',  # 45,000 or 5,00,000
        r'\b(?:rs\.?|₹|\$|inr|usd)\s*\d+',  # Rs.5000, $500, ₹10000
        r'\b\d+\s*(?:rupees?|dollars?|lakhs?|crores?)\b',  # 5000 rupees
        r'\b\d{4,}\b',  # Plain large numbers (4+ digits): 5000, 45000
    ]

    for pattern in money_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return "HIGH"

    # MEDIUM RISK: user is unsure or hesitating
    medium_risk_keywords = [
        "not sure",
        "can you explain",
        "why",
        "is this safe",
        "are you sure",
        "i don't understand",
        "can you tell me more",
        "how do i know",
        "is this real",
        "is this legit",
        "sounds suspicious",
    ]

    for keyword in medium_risk_keywords:
        if keyword in text:
            return "MEDIUM"

    # Otherwise, low risk
    return "LOW"


if __name__ == "__main__":
    tests = [
        ("Hi, what is this about?", "LOW"),
        ("I'm not sure, can you explain more?", "MEDIUM"),
        ("Okay, my name is Ramesh Kumar", "HIGH"),
        ("ok i am sending", "HIGH"),
        ("ok I will give you", "HIGH"),
        ("45,000", "HIGH"),
        ("SBI", "HIGH"),
        ("84567389290", "HIGH"),
        ("i will transfer the money", "HIGH"),
        ("5000 rupees", "HIGH"),
        ("hello", "LOW"),
    ]

    print("Running risk detection tests...")
    all_passed = True
    for msg, expected in tests:
        result = detect_risk(msg)
        status = "✓" if result == expected else "✗"
        if result != expected:
            all_passed = False
        print(f"{status} '{msg}' -> {result} (expected: {expected})")

    print(f"\n{'All tests passed!' if all_passed else 'Some tests failed!'}")

