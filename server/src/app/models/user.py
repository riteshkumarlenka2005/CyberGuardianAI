
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Column, Integer
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=True)  # Nullable for OAuth users
    
    first_name: Mapped[str] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str] = mapped_column(String(100), nullable=True)
    picture: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Email Verification
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    email_verification_token: Mapped[str] = mapped_column(String(100), nullable=True)
    email_verification_expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    
    # Auth Provider
    provider: Mapped[str] = mapped_column(String(50), default="local")  # local, google, github
    provider_id: Mapped[str] = mapped_column(String(255), nullable=True)  # ID from OAuth provider
    
    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"

