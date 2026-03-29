"""
Knowledge Card Domain Models
Complete implementation for Lumina Knowledge Platform
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, List, TYPE_CHECKING

from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy import String, Text, Integer, Boolean, DateTime, JSON, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from ....infra.db import Base

if TYPE_CHECKING:
    from ...auth.domain import User


class CardType(str, Enum):
    """Knowledge card types."""
    DOCUMENT = "document"
    TUTORIAL = "tutorial"
    FAQ = "faq"
    TALK = "talk"
    SCRIPT = "script"


class CardStatus(str, Enum):
    """Knowledge card status."""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


# SQLAlchemy Models
class Tag(Base):
    """Tag model for knowledge cards."""
    __tablename__ = "tags"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    slug: Mapped[Optional[str]] = mapped_column(String(60), unique=True, nullable=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    usage_count: Mapped[int] = mapped_column(default=0)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Category(Base):
    """Category model for organizing knowledge cards."""
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    parent_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("categories.id"), nullable=True
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    sort_order: Mapped[int] = mapped_column(default=0)
    card_count: Mapped[int] = mapped_column(default=0)
    
    # Self-referential relationship
    children: Mapped[List["Category"]] = relationship(
        "Category", backref="parent", remote_side=[id]
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Series(Base):
    """Series/Collection model."""
    __tablename__ = "series"
    __table_args__ = (
        Index("ix_series_author_id", "author_id"),
        Index("ix_series_created_at", "created_at"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[Optional[str]] = mapped_column(String(280), unique=True, nullable=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cover_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    total_chapters: Mapped[int] = mapped_column(default=0)
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    
    # Groups structure (JSON for flexible structure)
    groups: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Statistics
    total_views: Mapped[int] = mapped_column(default=0)
    total_likes: Mapped[int] = mapped_column(default=0)
    
    # Status
    is_published: Mapped[bool] = mapped_column(default=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    
    # Relationships
    cards: Mapped[List["KnowledgeCard"]] = relationship(
        "KnowledgeCard", back_populates="series", lazy="selectin"
    )


class KnowledgeCard(Base):
    """Knowledge Card model - Core entity."""
    __tablename__ = "knowledge_cards"
    __table_args__ = (
        Index("ix_knowledge_cards_author_status", "author_id", "status"),
        Index("ix_knowledge_cards_series_chapter", "series_id", "chapter_index"),
        Index("ix_knowledge_cards_type_status", "type", "status"),
        Index("ix_knowledge_cards_published_at", "published_at"),
        Index("ix_knowledge_cards_created_at", "created_at"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[Optional[str]] = mapped_column(String(280), unique=True, nullable=True, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Type and classification
    type: Mapped[str] = mapped_column(String(50), default=CardType.DOCUMENT.value, index=True)
    status: Mapped[str] = mapped_column(String(50), default=CardStatus.DRAFT.value, index=True)
    domain: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    category_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("categories.id"), nullable=True
    )
    
    # Author
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    
    # Series location (optional)
    series_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("series.id"), nullable=True)
    chapter_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    chapter_index: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Statistics (denormalized for performance)
    views: Mapped[int] = mapped_column(default=0)
    likes: Mapped[int] = mapped_column(default=0)
    comments: Mapped[int] = mapped_column(default=0)
    collects: Mapped[int] = mapped_column(default=0)
    shares: Mapped[int] = mapped_column(default=0)
    
    # Reading time (estimated minutes)
    reading_time: Mapped[int] = mapped_column(default=0)
    word_count: Mapped[int] = mapped_column(default=0)
    
    # SEO and metadata
    meta_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Featured content
    is_featured: Mapped[bool] = mapped_column(default=False, index=True)
    featured_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Publishing
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    
    # Version control
    version: Mapped[int] = mapped_column(default=1)
    last_edited_by: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    
    # Relationships
    series: Mapped[Optional["Series"]] = relationship(
        "Series", back_populates="cards", lazy="selectin"
    )
    card_tags: Mapped[List["CardTag"]] = relationship(
        "CardTag", back_populates="card", cascade="all, delete-orphan"
    )
    user_interactions: Mapped[List["UserCardInteraction"]] = relationship(
        "UserCardInteraction", back_populates="card", cascade="all, delete-orphan"
    )


class CardTag(Base):
    """Many-to-many relationship between cards and tags."""
    __tablename__ = "card_tags"
    __table_args__ = (
        UniqueConstraint("card_id", "tag_id", name="uq_card_tag"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    card_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("knowledge_cards.id", ondelete="CASCADE"), nullable=False, index=True
    )
    tag_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("tags.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    
    # Relationships
    card: Mapped["KnowledgeCard"] = relationship("KnowledgeCard", back_populates="card_tags")
    tag: Mapped["Tag"] = relationship("Tag")


class UserCardInteraction(Base):
    """User interactions with knowledge cards (likes, collects, shares)."""
    __tablename__ = "user_card_interactions"
    __table_args__ = (
        UniqueConstraint("user_id", "card_id", "interaction_type", name="uq_user_card_interaction"),
        Index("ix_user_card_interactions_user_type", "user_id", "interaction_type"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    card_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("knowledge_cards.id", ondelete="CASCADE"), nullable=False, index=True
    )
    interaction_type: Mapped[str] = mapped_column(String(20), nullable=False)  # like, collect, share
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    
    # Relationships
    card: Mapped["KnowledgeCard"] = relationship("KnowledgeCard", back_populates="user_interactions")


class CardVersion(Base):
    """Version history for knowledge cards."""
    __tablename__ = "card_versions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    card_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("knowledge_cards.id", ondelete="CASCADE"), nullable=False, index=True
    )
    version: Mapped[int] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    edited_by: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False
    )
    edit_message: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class ReadingHistory(Base):
    """User reading history for knowledge cards."""
    __tablename__ = "reading_history"
    __table_args__ = (
        Index("ix_reading_history_user_created", "user_id", "created_at"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    card_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("knowledge_cards.id", ondelete="CASCADE"), nullable=False, index=True
    )
    read_duration: Mapped[int] = mapped_column(default=0)  # seconds
    read_progress: Mapped[float] = mapped_column(default=0.0)  # 0.0 to 1.0
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# Pydantic Schemas
class CardStats(BaseModel):
    """Card statistics schema."""
    model_config = ConfigDict(from_attributes=True)
    
    views: int = 0
    likes: int = 0
    comments: int = 0
    collects: int = 0
    shares: int = 0


class CardLocation(BaseModel):
    """Card location within a series."""
    model_config = ConfigDict(from_attributes=True)
    
    series: str
    seriesId: str
    chapter: str
    chapterIndex: int


class AuthorBrief(BaseModel):
    """Brief author information."""
    model_config = ConfigDict(from_attributes=True)
    
    name: str
    avatar: Optional[str] = None
    guild: Optional[str] = None
    bio: Optional[str] = None


class UserInteractionInfo(BaseModel):
    """User interaction status for a card."""
    model_config = ConfigDict(from_attributes=True)
    
    is_liked: bool = False
    is_collected: bool = False
    is_shared: bool = False


class KnowledgeCardBase(BaseModel):
    """Base knowledge card schema."""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=2000)
    image: Optional[str] = None
    type: CardType = Field(default=CardType.DOCUMENT)
    domain: Optional[str] = Field(None, max_length=100)
    tags: List[str] = Field(default_factory=list, max_length=10)


class KnowledgeCardCreate(KnowledgeCardBase):
    """Schema for creating a knowledge card."""
    content: Optional[str] = None
    series_id: Optional[str] = None
    chapter_title: Optional[str] = Field(None, max_length=255)
    chapter_index: Optional[int] = Field(None, ge=1)
    category_id: Optional[str] = None
    status: CardStatus = Field(default=CardStatus.DRAFT)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = Field(None, max_length=500)


class KnowledgeCardUpdate(BaseModel):
    """Schema for updating a knowledge card."""
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    image: Optional[str] = None
    content: Optional[str] = None
    type: Optional[CardType] = None
    domain: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = Field(None, max_length=10)
    series_id: Optional[str] = None
    chapter_title: Optional[str] = Field(None, max_length=255)
    chapter_index: Optional[int] = Field(None, ge=1)
    category_id: Optional[str] = None
    status: Optional[CardStatus] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = Field(None, max_length=500)


class KnowledgeCardRead(BaseModel):
    """Schema for reading a knowledge card."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    description: str
    image: Optional[str] = None
    tags: List[str] = []
    domain: Optional[str] = None
    author: AuthorBrief
    type: str
    content: Optional[str] = None
    stats: CardStats
    location: Optional[CardLocation] = None
    status: str
    publishDate: str
    reading_time: int = 0
    word_count: int = 0
    version: int = 1
    user_interaction: Optional[UserInteractionInfo] = None


class KnowledgeCardBrief(BaseModel):
    """Brief card info for list display."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    description: str
    image: Optional[str] = None
    tags: List[str] = []
    domain: Optional[str] = None
    author: AuthorBrief
    type: str
    stats: CardStats
    publishDate: str
    reading_time: int = 0


class KnowledgeCardListResponse(BaseModel):
    """Paginated list of knowledge cards."""
    model_config = ConfigDict(from_attributes=True)
    
    items: List[KnowledgeCardBrief]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(
        cls,
        items: List[KnowledgeCardBrief],
        total: int,
        page: int,
        page_size: int
    ) -> "KnowledgeCardListResponse":
        """Create a paginated response."""
        import math
        total_pages = math.ceil(total / page_size) if page_size > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


class CardQueryParams(BaseModel):
    """Query parameters for card list."""
    model_config = ConfigDict(from_attributes=True)
    
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)
    author_id: Optional[str] = None
    series_id: Optional[str] = None
    card_type: Optional[CardType] = None
    domain: Optional[str] = None
    category_id: Optional[str] = None
    search: Optional[str] = Field(None, max_length=100)
    sort_by: str = Field(default="created_at")
    sort_order: str = Field(default="desc")
    status: Optional[CardStatus] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None


class CardInteractionCreate(BaseModel):
    """Schema for creating a card interaction."""
    model_config = ConfigDict(from_attributes=True)
    
    interaction_type: str = Field(..., pattern="^(like|collect|share)$")


class CardInteractionResponse(BaseModel):
    """Response for card interaction."""
    model_config = ConfigDict(from_attributes=True)
    
    success: bool = True
    interaction_type: str
    is_active: bool
    count: int


# Series Schemas
class SeriesChapter(BaseModel):
    """Series chapter reference."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    chapterIndex: int
    chapter: str


class SeriesGroup(BaseModel):
    """Grouped chapters in a series."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    icon: Optional[str] = None
    chapters: List[SeriesChapter]


class SeriesCreate(BaseModel):
    """Schema for creating a series."""
    model_config = ConfigDict(from_attributes=True)
    
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    cover_image: Optional[str] = None
    level: Optional[str] = Field(None, max_length=50)
    groups: Optional[List[dict]] = None


class SeriesUpdate(BaseModel):
    """Schema for updating a series."""
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    cover_image: Optional[str] = None
    level: Optional[str] = Field(None, max_length=50)
    groups: Optional[List[dict]] = None
    is_published: Optional[bool] = None


class SeriesRead(BaseModel):
    """Schema for reading a series."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    totalChapters: int
    level: Optional[str] = None
    cards: List[SeriesChapter] = []
    groups: Optional[List[SeriesGroup]] = None
    lastUpdated: Optional[str] = None
    total_views: int = 0
    total_likes: int = 0


class SeriesListResponse(BaseModel):
    """Paginated list of series."""
    model_config = ConfigDict(from_attributes=True)
    
    items: List[SeriesRead]
    total: int
    page: int
    page_size: int
    total_pages: int


# Tag Schema
class TagRead(BaseModel):
    """Tag read schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    name: str
    slug: Optional[str] = None
    usage_count: int = 0


class TagListResponse(BaseModel):
    """List of tags."""
    model_config = ConfigDict(from_attributes=True)
    
    items: List[TagRead]
    total: int


# Category Schema
class CategoryRead(BaseModel):
    """Category read schema."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    card_count: int = 0
    children: List["CategoryRead"] = []


class CategoryListResponse(BaseModel):
    """List of categories."""
    model_config = ConfigDict(from_attributes=True)
    
    items: List[CategoryRead]
