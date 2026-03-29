"""Dependencies module for dependency injection."""

from .database import provide_session

__all__ = [
    "provide_session",
]
