"""
Knowledge Card Module - API Routes
"""

from litestar import Router
from .cards import router as cards_router
from .comments import router as comments_router

# Combine all routers
router = Router(
    path="",
    route_handlers=[
        cards_router,
        comments_router,
    ],
)

__all__ = ["router"]
