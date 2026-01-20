"""
OAuth Configuration for CyberGuardian AI.
Loads OAuth credentials from environment variables.
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class OAuthSettings(BaseSettings):
    """OAuth configuration loaded from environment."""
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    
    # JWT Settings
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # App Settings
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


# Global settings instance
settings = OAuthSettings()


# OAuth Provider URLs
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USERINFO_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"
