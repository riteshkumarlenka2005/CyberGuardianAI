
import secrets
import random
from datetime import datetime, timedelta
from typing import Optional, Tuple
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..models.user import User
from ..schemas.auth import UserSignup, UserLogin
from ..security.password import hash_password, verify_password
from ..security.jwt import create_access_token
from ..security.config import settings
from .email_service import send_verification_email


def generate_otp_code() -> str:
    """Generate a 6-digit OTP code."""
    return str(random.randint(100000, 999999))


class AuthService:
    @staticmethod
    async def signup(db: AsyncSession, user_data: UserSignup) -> Tuple[User, str]:
        """
        Registers a new user with secure email verification.
        - Generates 6-digit OTP code
        - Sets 15-minute expiry
        - Sends verification email with code
        """
        # Check if email exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Generate 6-digit OTP code with expiry
        verification_code = generate_otp_code()
        expiry_time = datetime.utcnow() + timedelta(minutes=settings.EMAIL_VERIFICATION_EXPIRY_MINUTES)
        
        # Create user
        new_user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email_verification_token=verification_code,
            email_verification_expires_at=expiry_time,
            email_verified=False
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        # Send verification email with OTP code
        await send_verification_email(
            to_email=new_user.email,
            first_name=new_user.first_name or "User",
            verification_token=verification_code
        )
        
        return new_user, verification_code

    @staticmethod
    async def login(db: AsyncSession, credentials: UserLogin) -> str:
        """
        Validates login and returns a JWT token.
        CRITICAL: Blocks login if email is not verified.
        """
        result = await db.execute(select(User).where(User.email == credentials.email))
        user = result.scalar_one_or_none()

        # Check existence and password
        if not user or not user.hashed_password or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # CRITICAL: Block login if email not verified
        if not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please verify your email before logging in. Check your inbox for the verification link."
            )

        # Create JWT token
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}",
            "picture": user.picture,
            "provider": user.provider
        }
        
        return create_access_token(token_data)

    @staticmethod
    async def verify_email(db: AsyncSession, email: str, token: str) -> dict:
        """
        Verifies a user's email using a secure, time-bound, single-use token.
        
        Returns dict with status and message for proper error handling.
        """
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        # User not found
        if not user:
            return {"success": False, "error": "invalid_token", "message": "Invalid verification link"}

        # Already verified
        if user.email_verified:
            return {"success": False, "error": "already_verified", "message": "Email already verified. Please log in."}

        # Token doesn't match
        if user.email_verification_token != token:
            return {"success": False, "error": "invalid_token", "message": "Invalid verification token"}

        # Token expired
        if user.email_verification_expires_at and datetime.utcnow() > user.email_verification_expires_at:
            return {"success": False, "error": "expired_token", "message": "Verification link has expired. Please request a new one."}

        # SUCCESS: Verify the email
        user.email_verified = True
        user.email_verification_token = None  # Single-use: clear token
        user.email_verification_expires_at = None
        
        await db.commit()
        
        return {"success": True, "message": "Email verified successfully! You can now log in."}

    @staticmethod
    async def resend_verification(db: AsyncSession, email: str) -> dict:
        """
        Resend verification email with a new token.
        """
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            # Don't reveal if user exists
            return {"success": True, "message": "If this email exists, a verification link has been sent."}

        if user.email_verified:
            return {"success": False, "error": "already_verified", "message": "Email already verified."}

        # Generate new 6-digit OTP code
        verification_code = generate_otp_code()
        expiry_time = datetime.utcnow() + timedelta(minutes=settings.EMAIL_VERIFICATION_EXPIRY_MINUTES)
        
        user.email_verification_token = verification_code
        user.email_verification_expires_at = expiry_time
        
        await db.commit()
        
        # Send email with OTP code
        await send_verification_email(
            to_email=user.email,
            first_name=user.first_name or "User",
            verification_token=verification_code
        )
        
        return {"success": True, "message": "Verification email sent. Please check your inbox."}

    @staticmethod
    async def handle_oauth_user(db: AsyncSession, user_data: dict) -> str:
        """
        Processes OAuth user (login or create).
        OAuth users are auto-verified (trusted providers).
        """
        result = await db.execute(select(User).where(User.email == user_data["email"]))
        user = result.scalar_one_or_none()

        if not user:
            # Create new user for OAuth
            user = User(
                email=user_data["email"],
                first_name=user_data.get("name", "").split(" ")[0],
                last_name=" ".join(user_data.get("name", "").split(" ")[1:]),
                picture=user_data.get("picture"),
                provider=user_data["provider"],
                provider_id=user_data["sub"],
                email_verified=True  # Trusted providers are auto-verified
            )
            db.add(user)
        else:
            # Update existing user link if needed
            user.provider = user_data["provider"]
            user.provider_id = user_data["sub"]
            if user_data.get("picture"):
                user.picture = user_data["picture"]
            # Auto-verify if coming from OAuth
            if not user.email_verified:
                user.email_verified = True
        
        await db.commit()
        await db.refresh(user)

        # Return JWT
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}",
            "picture": user.picture,
            "provider": user.provider
        }
        return create_access_token(token_data)

