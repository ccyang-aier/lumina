"""
Comment Domain Models
"""

import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field
from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from ....infra.db import Base


# SQLAlchemy Model
class Comment(Base):
    """Comment model for knowledge cards."""
    __tablename__ = "comments"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Relationships
    card_id: Mapped[str] = mapped_column(String(36), ForeignKey("knowledge_cards.id"), nullable=False, index=True)
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    parent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("comments.id"), nullable=True, index=True)
    
    # Content attachments
    images: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)  # List of image URLs
    
    # Quote reference (for text selection comments)
    quote_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Statistics
    likes: Mapped[int] = mapped_column(default=0)
    replies_count: Mapped[int] = mapped_column(default=0)
    
    # Hot comment flag
    is_hot: Mapped[bool] = mapped_column(default=False)
    hot_score: Mapped[int] = mapped_column(default=0)
    
    # Status
    is_deleted: Mapped[bool] = mapped_column(default=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Like(Base):
    """Like record for comments and cards."""
    __tablename__ = "likes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    target_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'card' or 'comment'
    target_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# Pydantic Schemas
class CommentImage(BaseModel):
    """Comment image schema."""
    id: str
    url: str


class CommentAuthor(BaseModel):
    """Comment author schema."""
    name: str
    avatar: Optional[str] = None
    role: Optional[str] = None  # 'admin', 'author', 'user'


class CommentCreate(BaseModel):
    """Schema for creating a comment."""
    content: str = Field(..., min_length=1, max_length=1000)
    parent_id: Optional[str] = None
    images: Optional[List[CommentImage]] = None
    quote_text: Optional[str] = None


class CommentUpdate(BaseModel):
    """Schema for updating a comment."""
    content: Optional[str] = Field(None, min_length=1, max_length=1000)
    images: Optional[List[CommentImage]] = None


class CommentRead(BaseModel):
    """Schema for reading a comment."""
    id: str
    content: str
    author: CommentAuthor
    createdAt: datetime
    likes: int
    isLiked: bool = False
    replies: List["CommentRead"] = []
    images: Optional[List[CommentImage]] = None
    isHot: bool = False
    hotScore: int = 0
    quoteText: Optional[str] = None
    parentId: Optional[str] = None
    
    class Config:
        from_attributes = True


# Allow self-referencing model
CommentRead.model_rebuild()


class CommentListResponse(BaseModel):
    """Paginated list of comments."""
    items: List[CommentRead]
    total: int
    hot_comments: List[CommentRead] = []


class LikeResponse(BaseModel):
    """Response for like action."""
    liked: bool
    likes_count: int
