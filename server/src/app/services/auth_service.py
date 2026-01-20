
import secrets
from typing import Optional, Tuple
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..models.user import User
from ..schemas.auth import UserSignup, UserLogin
from ..security.password import hash_password, verify_password
from ..security.jwt import create_access_token

class AuthService:
    @staticmethod
    async def signup(db: AsyncSession, user_data: UserSignup) -> Tuple[User, str]:
        """
        Registers a new user.
        Raises error if email already exists.
        Returns the user and a verification token.
        """
        # Check if email exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user
        verification_token = secrets.token_urlsafe(32)
        new_user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            verification_token=verification_token,
            email_verified=False
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        # In development, we log the token to console
        print(f"\n[DEV] VERIFICATION EMAIL for {new_user.email}")
        print(f"Token: {verification_token}")
        print(f"URL: http://localhost:3000/verify-email?email={new_user.email}&token={verification_token}\n")
        
        return new_user, verification_token

    @staticmethod
    async def login(db: AsyncSession, credentials: UserLogin) -> str:
        """
        Validates login and returns a JWT token.
        Enforces email verification.
        """
        result = await db.execute(select(User).where(User.email == credentials.email))
        user = result.scalar_one_or_none()

        # Check existence and password
        if not user or not user.hashed_password or not verify_password(credentials.password, user.hashed_password):
            # Same error message for security (don't reveal if email exists)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Enforce email verification
        if not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email not verified. Please verify your email to continue."
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
    async def verify_email(db: AsyncSession, email: str, token: str) -> bool:
        """
        Verifies a user's email using a token.
        """
        result = await db.execute(
            select(User).where(User.email == email, User.verification_token == token)
        )
        user = result.scalar_one_or_none()

        if not user:
            return False

        user.email_verified = True
        user.verification_token = None
        
        await db.commit()
        return True

    @staticmethod
    async def handle_oauth_user(db: AsyncSession, user_data: dict) -> str:
        """
        Processes OAuth user (login or create).
        OAuth users are auto-verified.
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
                email_verified=True # Trusted providers are auto-verified
            )
            db.add(user)
        else:
            # Update existing user link if needed
            user.provider = user_data["provider"]
            user.provider_id = user_data["sub"]
            if user_data.get("picture"):
                user.picture = user_data["picture"]
        
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
