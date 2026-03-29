"""
Auth Module - API Routes
"""

from litestar import Router, post, get, put, delete
from litestar.exceptions import HTTPException
from pydantic import BaseModel
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..domain import User, UserCreate, UserRead, UserUpdate
from ....app.dependencies import provide_session


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str
    token_type: str = "bearer"


@post("/register", summary="Register a new user")
async def register(
    data: UserCreate,
    db: Annotated[AsyncSession, "db_session"] = None,
) -> UserRead:
    """Register a new user."""
    # Check if user exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user (password should be hashed in production)
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=f"hashed_{data.password}",  # TODO: Use proper password hashing
        full_name=data.full_name,
        role=data.role.value,
    )
    db.add(user)
    await db.flush()

    return UserRead.model_validate(user)


@post("/login", summary="Login")
async def login() -> TokenResponse:
    """User login endpoint."""
    # TODO: Implement actual authentication
    return TokenResponse(access_token="sample_token")


@get("/me", summary="Get current user")
async def get_current_user() -> UserRead:
    """Get current authenticated user."""
    # TODO: Implement actual user retrieval
    raise HTTPException(status_code=501, detail="Not implemented")


# Auth router
router = Router(path="/auth", route_handlers=[register, login, get_current_user])
