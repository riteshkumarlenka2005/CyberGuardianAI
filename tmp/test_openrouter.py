import sys
import os
import requests
from pathlib import Path

# Add project root to sys.path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from ai.llm.openrouter_client import call_llm

def test_openrouter():
    print("Testing OpenRouter integration...")
    try:
        response = call_llm("Hello, respond with 'OpenRouter is working!' if you see this.")
        print(f"Response: {response}")
        if "OpenRouter is working" in response:
            print("✅ TEST PASSED")
        else:
            print("⚠️ TEST FAILED: Response did not match expected output.")
    except requests.exceptions.HTTPError as e:
        print(f"❌ TEST FAILED with HTTP error: {str(e)}")
        if e.response is not None:
            print(f"Response Content: {e.response.text}")
    except Exception as e:
        print(f"❌ TEST FAILED with error: {str(e)}")

if __name__ == "__main__":
    test_openrouter()
