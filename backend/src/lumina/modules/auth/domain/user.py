"""
User Domain Models - Complete Implementation
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import String, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ....infra.db import Base


class UserRole(str, Enum):
    """User roles enumeration."""
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"


class UserStatus(str, Enum):
    """User account status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


# SQLAlchemy Model
class User(Base):
    """User database model."""
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    guild: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    role: Mapped[str] = mapped_column(String(50), default=UserRole.USER.value)
    status: Mapped[str] = mapped_column(String(50), default=UserStatus.ACTIVE.value)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Statistics
    knowledge_count: Mapped[int] = mapped_column(default=0)
    comment_count: Mapped[int] = mapped_column(default=0)
    likes_received: Mapped[int] = mapped_column(default=0)
    
    # Settings (JSON field for flexible user preferences)
    settings: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


# Pydantic Schemas
class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=100, description="Username")
    full_name: Optional[str] = Field(None, max_length=255, description="Full name")


class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=8, max_length=100, description="Password")
    bio: Optional[str] = Field(None, max_length=500, description="User bio")
    guild: Optional[str] = Field(None, max_length=100, description="Guild/Organization")


class UserUpdate(BaseModel):
    """User update schema."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=255)
    bio: Optional[str] = Field(None, max_length=500)
    avatar: Optional[str] = Field(None, max_length=500)
    guild: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=100)


class UserRead(BaseModel):
    """User read schema - public profile."""
    id: str
    email: str
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    guild: Optional[str] = None
    role: str
    is_active: bool
    knowledge_count: int = 0
    comment_count: int = 0
    likes_received: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserBrief(BaseModel):
    """Brief user info for nested display."""
    name: str
    avatar: Optional[str] = None
    guild: Optional[str] = None
    bio: Optional[str] = None
    role: Optional[str] = None

    @classmethod
    def from_user(cls, user: User) -> "UserBrief":
        return cls(
            name=user.username,
            avatar=user.avatar,
            guild=user.guild,
            bio=user.bio[:100] if user.bio else None,
        )


class UserLogin(BaseModel):
    """User login schema."""
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., description="Password")


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int
    user: UserRead
