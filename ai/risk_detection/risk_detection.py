def detect_risk(user_message: str) -> str:
    """
    Analyze the user's last message and return a risk level:
    LOW, MEDIUM, or HIGH
    """

    text = user_message.lower()

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
        # Intent to comply (MUST be treated as HIGH)
        "ok i am sending",
        "okay i am sending",
        "ok i will send",
        "i will send",
        "i am sending",
        "sending now",
        "sending it",
        "let me send",
        "yes i will",
        "yes i am",
        "i will do it",
        "okay i will",
        "sure i will",
        "i'll send",
        "i'll do it",
        "yes i confirm",
        "i confirm",
        "ok done",
        "okay done",
        "i have sent",
        "just sent",
        "already sent",
        "shared it",
        "here you go",
        "giving you",
        "i am giving",
    ]

    for keyword in high_risk_keywords:
        if keyword in text:
            return "HIGH"

    # MEDIUM RISK: user is unsure or hesitating
    medium_risk_keywords = [
        "not sure",
        "can you explain",
        "why",
        "is this safe",
        "are you sure",
        "i don't understand",
        "can you tell me more"
    ]

    for keyword in medium_risk_keywords:
        if keyword in text:
            return "MEDIUM"

    # Otherwise, low risk
    return "LOW"


if __name__ == "__main__":
    tests = [
        "Hi, what is this about?",
        "I'm not sure, can you explain more?",
        "Okay, my name is Ramesh Kumar"
    ]

    for msg in tests:
        print(msg, "->", detect_risk(msg))
