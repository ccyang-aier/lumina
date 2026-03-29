"""
Database Dependency Injection
"""

from collections.abc import AsyncGenerator
from typing import Annotated

from litestar.di import Provide
from sqlalchemy.ext.asyncio import AsyncSession

from ...infra.db import get_session


async def provide_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides a database session.
    This is a wrapper around the get_session function for dependency injection.
    """
    async for session in get_session():
        yield session


# Type alias for database session dependency
DBSession = Annotated[AsyncSession, "db_session"]

# Dependency provider
db_session_provider = Provide(provide_session)
