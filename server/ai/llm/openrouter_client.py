"""
OpenRouter API Client for CyberGuardian AI.
Replaces local Ollama for deployment. The original ollama_client.py is preserved
for local development — to switch back, just change the imports in the caller files.

Usage:
    from ai.llm.openrouter_client import call_llm
    response = call_llm("Your prompt here")
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
project_root = Path(__file__).resolve().parent.parent.parent
load_dotenv(project_root / ".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def call_llm(prompt: str) -> str:
    """
    Send a prompt to OpenRouter and return the response text.
    Drop-in replacement for call_ollama(prompt).
    """
    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not set. "
            "Add it to your .env file or switch back to Ollama for local dev."
        )

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1024,
    }

    response = requests.post(OPENROUTER_URL, json=payload, headers=headers, timeout=30)
    response.raise_for_status()

    data = response.json()

    # Extract the assistant's reply
    return data["choices"][0]["message"]["content"].strip()
