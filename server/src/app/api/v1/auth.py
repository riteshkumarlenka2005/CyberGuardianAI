"""
OAuth Authentication API Routes for CyberGuardian AI.
Handles Google and GitHub OAuth flows.
"""

from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import RedirectResponse
import httpx
import secrets
from urllib.parse import urlencode
from typing import Optional

from ..security.config import (
    settings,
    GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, GOOGLE_USERINFO_URL,
    GITHUB_AUTH_URL, GITHUB_TOKEN_URL, GITHUB_USERINFO_URL, GITHUB_EMAILS_URL
)
from ..security.jwt import create_access_token


router = APIRouter()

# In-memory state storage (use Redis in production)
_oauth_states = {}


# ================================================
# GOOGLE OAUTH
# ================================================

@router.get("/google/login")
async def google_login():
    """
    Initiates Google OAuth flow.
    Redirects user to Google's auth page.
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
        )
    
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = "google"
    
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": f"{settings.BACKEND_URL}/api/v1/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent"
    }
    
    auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
async def google_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None)
):
    """
    Handles Google OAuth callback.
    Exchanges code for token and creates JWT.
    """
    if error:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error={error}"
        )
    
    if not code or not state:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=missing_params"
        )
    
    # Verify state
    if state not in _oauth_states or _oauth_states[state] != "google":
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=invalid_state"
        )
    del _oauth_states[state]
    
    try:
        # Exchange code for token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": f"{settings.BACKEND_URL}/api/v1/auth/google/callback"
                }
            )
            token_data = token_response.json()
            
            if "error" in token_data:
                return RedirectResponse(
                    url=f"{settings.FRONTEND_URL}/login?error={token_data['error']}"
                )
            
            access_token = token_data["access_token"]
            
            # Get user info
            userinfo_response = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            user_data = userinfo_response.json()
        
        # Create JWT
        jwt_token = create_access_token({
            "sub": user_data["id"],
            "email": user_data["email"],
            "name": user_data.get("name", ""),
            "picture": user_data.get("picture", ""),
            "provider": "google"
        })
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}&provider=google"
        )
        
    except Exception as e:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=oauth_failed"
        )


# ================================================
# GITHUB OAUTH
# ================================================

@router.get("/github/login")
async def github_login():
    """
    Initiates GitHub OAuth flow.
    Redirects user to GitHub's auth page.
    """
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET."
        )
    
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = "github"
    
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": f"{settings.BACKEND_URL}/api/v1/auth/github/callback",
        "scope": "read:user user:email",
        "state": state
    }
    
    auth_url = f"{GITHUB_AUTH_URL}?{urlencode(params)}"
    return RedirectResponse(url=auth_url)


@router.get("/github/callback")
async def github_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None)
):
    """
    Handles GitHub OAuth callback.
    Exchanges code for token and creates JWT.
    """
    if error:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error={error}"
        )
    
    if not code or not state:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=missing_params"
        )
    
    # Verify state
    if state not in _oauth_states or _oauth_states[state] != "github":
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=invalid_state"
        )
    del _oauth_states[state]
    
    try:
        async with httpx.AsyncClient() as client:
            # Exchange code for token
            token_response = await client.post(
                GITHUB_TOKEN_URL,
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": f"{settings.BACKEND_URL}/api/v1/auth/github/callback"
                },
                headers={"Accept": "application/json"}
            )
            token_data = token_response.json()
            
            if "error" in token_data:
                return RedirectResponse(
                    url=f"{settings.FRONTEND_URL}/login?error={token_data['error']}"
                )
            
            access_token = token_data["access_token"]
            
            # Get user info
            userinfo_response = await client.get(
                GITHUB_USERINFO_URL,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )
            user_data = userinfo_response.json()
            
            # Get user email (might be private)
            email = user_data.get("email")
            if not email:
                emails_response = await client.get(
                    GITHUB_EMAILS_URL,
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json"
                    }
                )
                emails = emails_response.json()
                primary_email = next(
                    (e for e in emails if e.get("primary")),
                    emails[0] if emails else None
                )
                email = primary_email["email"] if primary_email else ""
        
        # Create JWT
        jwt_token = create_access_token({
            "sub": str(user_data["id"]),
            "email": email,
            "name": user_data.get("name") or user_data.get("login", ""),
            "picture": user_data.get("avatar_url", ""),
            "provider": "github"
        })
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}&provider=github"
        )
        
    except Exception as e:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=oauth_failed"
        )


# ================================================
# USER INFO & SESSION
# ================================================

@router.get("/me")
async def get_current_user_info(
    authorization: Optional[str] = Query(None, alias="token")
):
    """
    Get current user info from token.
    Can be called from frontend to verify token.
    """
    from ..security.jwt import decode_token
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )
    
    # Remove 'Bearer ' prefix if present
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    payload = decode_token(token)
    
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture"),
        "provider": payload.get("provider")
    }


@router.post("/logout")
async def logout():
    """
    Logout endpoint.
    For JWT, logout is handled client-side by deleting the token.
    This endpoint exists for consistency.
    """
    return {"message": "Logged out successfully"}
