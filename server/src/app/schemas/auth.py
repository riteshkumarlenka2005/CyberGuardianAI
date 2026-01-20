
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    provider: str = "local"

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    picture: Optional[str]
    email_verified: bool
    provider: str

    class Config:
        from_attributes = True

class EmailVerification(BaseModel):
    email: EmailStr
    token: str
