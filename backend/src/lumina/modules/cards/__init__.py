"""
Knowledge Card Module
"""

from .domain import (
    # Models
    KnowledgeCard,
    Series,
    Tag,
    CardTag,
    Comment,
    Like,
    # Enums
    CardType,
    CardStatus,
    # Card Schemas
    CardStats,
    CardLocation,
    AuthorBrief,
    KnowledgeCardCreate,
    KnowledgeCardUpdate,
    KnowledgeCardRead,
    KnowledgeCardBrief,
    KnowledgeCardListResponse,
    # Series Schemas
    SeriesChapter,
    SeriesGroup,
    SeriesCreate,
    SeriesRead,
    # Comment Schemas
    CommentCreate,
    CommentUpdate,
    CommentRead,
    CommentListResponse,
    LikeResponse,
)
from .service import KnowledgeCardService, SeriesService, CommentService
from .api import router as cards_router

__all__ = [
    # Models
    "KnowledgeCard",
    "Series",
    "Tag",
    "CardTag",
    "Comment",
    "Like",
    # Enums
    "CardType",
    "CardStatus",
    # Card Schemas
    "CardStats",
    "CardLocation",
    "AuthorBrief",
    "KnowledgeCardCreate",
    "KnowledgeCardUpdate",
    "KnowledgeCardRead",
    "KnowledgeCardBrief",
    "KnowledgeCardListResponse",
    # Series Schemas
    "SeriesChapter",
    "SeriesGroup",
    "SeriesCreate",
    "SeriesRead",
    # Comment Schemas
    "CommentCreate",
    "CommentUpdate",
    "CommentRead",
    "CommentListResponse",
    "LikeResponse",
    # Services
    "KnowledgeCardService",
    "SeriesService",
    "CommentService",
    # Routers
    "cards_router",
]
