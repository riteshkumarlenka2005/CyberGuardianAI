
from fastapi import APIRouter, HTTPException, status, Query, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import secrets
from urllib.parse import urlencode
from typing import Optional

from ...security.config import (
    settings,
    GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, GOOGLE_USERINFO_URL,
    GITHUB_AUTH_URL, GITHUB_TOKEN_URL, GITHUB_USERINFO_URL, GITHUB_EMAILS_URL
)
from ...schemas.auth import UserSignup, UserLogin, Token, UserResponse, EmailVerification
from ...services.auth_service import AuthService
from sqlalchemy.future import select
from ...models.user import User
from ...database import get_db
from ...security.jwt import decode_token

router = APIRouter()

# ================================================
# EMAIL / PASSWORD AUTH
# ================================================

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignup, db: AsyncSession = Depends(get_db)):
    """Registers a new user and triggers email verification."""
    try:
        user, _ = await AuthService.signup(db, user_data)
        return user
    except Exception as e:
        print(f"SIGNUP ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Log in with email and password."""
    token = await AuthService.login(db, credentials)
    return {"access_token": token, "token_type": "bearer", "provider": "local"}

@router.get("/verify-email")
async def verify_email(
    email: str = Query(...),
    token: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """Verifies user email via link/token."""
    success = await AuthService.verify_email(db, email, token)
    if not success:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=invalid_verification_token")
    
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?message=email_verified")

@router.post("/verify-email-otp")
async def verify_email_otp(data: EmailVerification, db: AsyncSession = Depends(get_db)):
    """Verifies user email via OTP/input."""
    success = await AuthService.verify_email(db, data.email, data.token)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    return {"message": "Email verified successfully"}

# ================================================
# GOOGLE OAUTH
# ================================================

@router.get("/google/login")
async def google_login(request: Request):
    """Initiates Google OAuth flow."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured."
        )
    
    state = secrets.token_urlsafe(32)
    request.session["oauth_state"] = state
    request.session["oauth_provider"] = "google"
    
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": f"{settings.BACKEND_URL}/api/v1/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent"
    }
    
    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")

@router.get("/google/callback")
async def google_callback(
    request: Request,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Handles Google OAuth callback and links to database."""
    if error:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error={error}")
    
    if not code or not state:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=missing_params")
    
    if request.session.get("oauth_state") != state or request.session.get("oauth_provider") != "google":
        request.session.clear()
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=invalid_state")
    
    request.session.pop("oauth_state", None)
    request.session.pop("oauth_provider", None)
    
    try:
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
                return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error={token_data['error']}")
            
            userinfo_response = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )
            user_data = userinfo_response.json()
            user_data["provider"] = "google"
            
            jwt_token = await AuthService.handle_oauth_user(db, user_data)
            
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}&provider=google"
        )
    except Exception:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_failed")

# ================================================
# GITHUB OAUTH
# ================================================

@router.get("/github/login")
async def github_login(request: Request):
    """Initiates GitHub OAuth flow."""
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="GitHub OAuth is not configured."
        )
    
    state = secrets.token_urlsafe(32)
    request.session["oauth_state"] = state
    request.session["oauth_provider"] = "github"
    
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": f"{settings.BACKEND_URL}/api/v1/auth/github/callback",
        "scope": "read:user user:email",
        "state": state
    }
    
    return RedirectResponse(url=f"{GITHUB_AUTH_URL}?{urlencode(params)}")

@router.get("/github/callback")
async def github_callback(
    request: Request,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Handles GitHub OAuth callback and links to database."""
    if error:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error={error}")
    
    if not code or not state:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=missing_params")
    
    if request.session.get("oauth_state") != state or request.session.get("oauth_provider") != "github":
        request.session.clear()
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=invalid_state")
    
    request.session.pop("oauth_state", None)
    request.session.pop("oauth_provider", None)
    
    try:
        async with httpx.AsyncClient() as client:
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
                return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error={token_data['error']}")
            
            user_response = await client.get(
                GITHUB_USERINFO_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}", "Accept": "application/json"}
            )
            github_user = user_response.json()
            
            email_response = await client.get(
                GITHUB_EMAILS_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}", "Accept": "application/json"}
            )
            emails = email_response.json()
            primary_email = next((e for e in emails if e.get("primary")), emails[0])["email"]
            
            user_data = {
                "sub": str(github_user["id"]),
                "email": primary_email,
                "name": github_user.get("name") or github_user.get("login"),
                "picture": github_user.get("avatar_url"),
                "provider": "github"
            }
            
            jwt_token = await AuthService.handle_oauth_user(db, user_data)
            
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}&provider=github"
        )
    except Exception:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_failed")

# ================================================
# SESSION
# ================================================

@router.get("/me", response_model=UserResponse)
async def get_me(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    """Verifies and returns the current user profile."""
    payload = decode_token(token)
    user_id = int(payload.get("sub"))
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.post("/logout")
async def logout():
    return {"message": "Logged out"}
