"""
Application Lifecycle Events
Handle startup and shutdown events for the application.
"""

from litestar.datastructures import State
from loguru import logger

from ..db import close_db, init_db


async def on_startup(app_state: State) -> None:
    """Application startup event handler."""
    logger.info("Starting Lumina backend...")

    # Initialize database (optional - tables should be managed by migrations)
    # await init_db()
    # logger.info("Database initialized")

    logger.info("Lumina backend started successfully")


async def on_shutdown(app_state: State) -> None:
    """Application shutdown event handler."""
    logger.info("Shutting down Lumina backend...")

    # Close database connections
    await close_db()
    logger.info("Database connections closed")

    logger.info("Lumina backend shutdown complete")
