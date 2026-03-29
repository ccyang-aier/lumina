"""
Lumina Backend ASGI Application
Main entry point for the Litestar application.
"""

import sys
from pathlib import Path

# Add project root to path for imports
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from litestar import Litestar, Router
from litestar.config.cors import CORSConfig
from litestar.openapi import OpenAPIConfig

from configs import settings
from .api import health_router
from .dependencies import provide_session
from .middlewares import LoggingMiddleware, ErrorHandlerMiddleware
from ..infra.events import on_startup, on_shutdown
from ..modules.auth import auth_router

# Import observability to initialize logging
from ..infra.observability import logger  # noqa: F401


# API Router
api_router = Router(
    path="/api",
    route_handlers=[
        health_router,
        auth_router,
    ],
)


# CORS Configuration
cors_config = CORSConfig(
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# OpenAPI Configuration
openapi_config = OpenAPIConfig(
    title=settings.name,
    version=settings.version,
    description=settings.description,
    path="/docs",  # Swagger UI at /docs
)


# Create Litestar application
app = Litestar(
    route_handlers=[api_router],
    cors_config=cors_config,
    openapi_config=openapi_config,
    debug=settings.debug,
    dependencies={"db_session": provide_session},
    on_startup=[on_startup],
    on_shutdown=[on_shutdown],
)
