"""
JWT Token Utilities for CyberGuardian AI.
Handles token creation, validation, and user extraction.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .config import settings


# Security scheme for protected routes
security = HTTPBearer(auto_error=False)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Payload data to encode in the token
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow()
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT token.
    
    Args:
        token: The JWT token to decode
    
    Returns:
        Decoded payload
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[Dict[str, Any]]:
    """
    Dependency to get current user from JWT token.
    Returns None if no token provided (for optional auth).
    """
    if credentials is None:
        return None
    
    token = credentials.credentials
    payload = decode_token(token)
    
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture"),
        "provider": payload.get("provider")
    }


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
) -> Dict[str, Any]:
    """
    Dependency that requires authentication.
    Raises 401 if not authenticated.
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture"),
        "provider": payload.get("provider")
    }
