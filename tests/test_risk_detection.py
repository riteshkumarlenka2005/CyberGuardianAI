"""
Tests for risk detection module.
Run with: python -m pytest tests/test_risk_detection.py -v
"""
import sys
import os

# Add project root to path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from ai.risk_detection.risk_detection import detect_risk


class TestIntentToComplyIsHighRisk:
    """Test that intent to comply triggers HIGH risk."""
    
    def test_ok_i_am_sending(self):
        assert detect_risk("ok i am sending") == "HIGH"
    
    def test_okay_i_am_sending(self):
        assert detect_risk("okay i am sending the documents") == "HIGH"
    
    def test_i_will_send(self):
        assert detect_risk("i will send it now") == "HIGH"
    
    def test_sending_now(self):
        assert detect_risk("sending now") == "HIGH"
    
    def test_yes_i_confirm(self):
        assert detect_risk("yes i confirm") == "HIGH"
    
    def test_let_me_send(self):
        assert detect_risk("let me send that to you") == "HIGH"
    
    def test_i_am_giving(self):
        assert detect_risk("i am giving you my details") == "HIGH"
    
    def test_here_you_go(self):
        assert detect_risk("here you go") == "HIGH"
    
    def test_just_sent(self):
        assert detect_risk("just sent the files") == "HIGH"


class TestExplicitDataIsHighRisk:
    """Test that explicit data sharing triggers HIGH risk."""
    
    def test_my_name_is(self):
        assert detect_risk("my name is John Smith") == "HIGH"
    
    def test_ssn(self):
        assert detect_risk("my ssn is 123-45-6789") == "HIGH"
    
    def test_otp(self):
        assert detect_risk("the otp is 456789") == "HIGH"
    
    def test_bank_account(self):
        assert detect_risk("my bank account number is 12345") == "HIGH"
    
    def test_credit_card(self):
        assert detect_risk("my credit card number") == "HIGH"


class TestMediumRiskMessages:
    """Test that hesitant/questioning messages trigger MEDIUM risk."""
    
    def test_not_sure(self):
        assert detect_risk("i'm not sure about this") == "MEDIUM"
    
    def test_can_you_explain(self):
        assert detect_risk("can you explain more?") == "MEDIUM"
    
    def test_is_this_safe(self):
        assert detect_risk("is this safe to do?") == "MEDIUM"


class TestLowRiskMessages:
    """Test that normal messages trigger LOW risk."""
    
    def test_hello(self):
        assert detect_risk("hello") == "LOW"
    
    def test_what_is_this(self):
        assert detect_risk("what is this about?") == "LOW"
    
    def test_ok_simple(self):
        # Plain "ok" without compliance intent should be LOW
        assert detect_risk("ok") == "LOW"
    
    def test_tell_me_more(self):
        assert detect_risk("tell me more") == "LOW"


if __name__ == "__main__":
    # Quick manual test
    test_messages = [
        ("ok i am sending", "HIGH"),
        ("sending now", "HIGH"),
        ("my name is John", "HIGH"),
        ("not sure about this", "MEDIUM"),
        ("hello", "LOW"),
    ]
    
    print("Running manual tests...")
    all_passed = True
    for msg, expected in test_messages:
        result = detect_risk(msg)
        status = "✓" if result == expected else "✗"
        if result != expected:
            all_passed = False
        print(f"{status} '{msg}' -> {result} (expected: {expected})")
    
    print(f"\n{'All tests passed!' if all_passed else 'Some tests failed!'}")
