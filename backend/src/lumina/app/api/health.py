"""
Health Check API Routes
"""

from litestar import Router, get
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    service: str
    version: str


class ReadyResponse(BaseModel):
    """Readiness check response model."""

    status: str
    database: str
    redis: str


@get("/health", summary="Health Check", description="Check if the service is running")
async def health() -> HealthResponse:
    """
    Health check endpoint.
    Returns basic service health status.
    """
    return HealthResponse(
        status="ok",
        service="lumina-backend",
        version="1.0.0",
    )


@get("/ready", summary="Readiness Check", description="Check if the service is ready to accept requests")
async def ready() -> ReadyResponse:
    """
    Readiness check endpoint.
    Checks database and Redis connections.
    """
    # TODO: Add actual health checks for database and Redis
    return ReadyResponse(
        status="ok",
        database="connected",
        redis="connected",
    )


# Create health router
router = Router(path="", route_handlers=[health, ready])
