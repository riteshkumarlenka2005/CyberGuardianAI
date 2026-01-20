def detect_risk(user_message: str) -> str:
    """
    Analyze the user's last message and return a risk level:
    LOW, MEDIUM, or HIGH
    """

    text = user_message.lower()

    # HIGH RISK: user is about to comply or share data
    high_risk_keywords = [
        "my name is",
        "date of birth",
        "dob",
        "here are my details",
        "last 4 digits",
        "social security",
        "ssn",
        "otp",
        "code is",
        "i will send",
        "okay i will",
        "yes i confirm"
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
