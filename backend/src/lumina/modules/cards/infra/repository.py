"""
Knowledge Card Repository Layer
Complete implementation for data access
"""

import math
import re
from datetime import datetime
from typing import Optional, List, Tuple, Set
from sqlalchemy import select, func, or_, and_, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload

from ..domain import (
    KnowledgeCard,
    Series,
    Tag,
    CardTag,
    Category,
    UserCardInteraction,
    CardVersion,
    ReadingHistory,
    CardType,
    CardStatus,
    CardQueryParams,
)


class CardRepository:
    """Repository for Knowledge Card data access."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, card: KnowledgeCard) -> KnowledgeCard:
        """Create a new knowledge card."""
        self.db.add(card)
        await self.db.flush()
        await self.db.refresh(card)
        return card

    async def get_by_id(
        self, 
        card_id: str, 
        include_content: bool = True,
        increment_view: bool = False
    ) -> Optional[KnowledgeCard]:
        """Get a knowledge card by ID."""
        query = select(KnowledgeCard).where(KnowledgeCard.id == card_id)
        
        result = await self.db.execute(query)
        card = result.scalar_one_or_none()
        
        if card and increment_view:
            card.views += 1
            await self.db.flush()
            
        return card

    async def get_by_slug(self, slug: str) -> Optional[KnowledgeCard]:
        """Get a knowledge card by slug."""
        result = await self.db.execute(
            select(KnowledgeCard).where(KnowledgeCard.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_list(
        self,
        params: CardQueryParams,
        user_id: Optional[str] = None
    ) -> Tuple[List[KnowledgeCard], int]:
        """Get paginated list of knowledge cards with filters."""
        query = select(KnowledgeCard)
        
        # Base filter: only published cards for non-authors
        if not user_id or (params.author_id and params.author_id != user_id):
            query = query.where(KnowledgeCard.status == CardStatus.PUBLISHED.value)
        elif params.status:
            query = query.where(KnowledgeCard.status == params.status.value)
        
        # Apply filters
        if params.author_id:
            query = query.where(KnowledgeCard.author_id == params.author_id)
        if params.series_id:
            query = query.where(KnowledgeCard.series_id == params.series_id)
        if params.card_type:
            query = query.where(KnowledgeCard.type == params.card_type.value)
        if params.domain:
            query = query.where(KnowledgeCard.domain == params.domain)
        if params.category_id:
            query = query.where(KnowledgeCard.category_id == params.category_id)
        if params.is_featured is not None:
            query = query.where(KnowledgeCard.is_featured == params.is_featured)
        
        # Search
        if params.search:
            search_term = f"%{params.search}%"
            query = query.where(
                or_(
                    KnowledgeCard.title.ilike(search_term),
                    KnowledgeCard.description.ilike(search_term),
                    KnowledgeCard.content.ilike(search_term),
                )
            )
        
        # Tag filter
        if params.tags:
            # Join with tags
            tag_subquery = (
                select(CardTag.card_id)
                .join(Tag, Tag.id == CardTag.tag_id)
                .where(Tag.name.in_(params.tags))
                .group_by(CardTag.card_id)
                .having(func.count(CardTag.tag_id) >= len(params.tags))
            )
            query = query.where(KnowledgeCard.id.in_(tag_subquery))
        
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0
        
        # Apply sorting
        sort_column = getattr(KnowledgeCard, params.sort_by, KnowledgeCard.created_at)
        if params.sort_order == "desc":
            query = query.order_by(sort_column.desc(), KnowledgeCard.created_at.desc())
        else:
            query = query.order_by(sort_column.asc(), KnowledgeCard.created_at.desc())
        
        # Apply pagination
        offset = (params.page - 1) * params.page_size
        query = query.offset(offset).limit(params.page_size)
        
        result = await self.db.execute(query)
        cards = list(result.scalars().all())
        
        return cards, total

    async def update(self, card: KnowledgeCard) -> KnowledgeCard:
        """Update a knowledge card."""
        await self.db.flush()
        await self.db.refresh(card)
        return card

    async def delete(self, card_id: str) -> bool:
        """Soft delete a knowledge card by setting status to archived."""
        result = await self.db.execute(
            update(KnowledgeCard)
            .where(KnowledgeCard.id == card_id)
            .values(status=CardStatus.ARCHIVED.value)
        )
        return result.rowcount > 0

    async def hard_delete(self, card_id: str) -> bool:
        """Permanently delete a knowledge card."""
        result = await self.db.execute(
            delete(KnowledgeCard).where(KnowledgeCard.id == card_id)
        )
        return result.rowcount > 0

    async def get_by_author(
        self, 
        author_id: str, 
        limit: int = 10,
        exclude_id: Optional[str] = None
    ) -> List[KnowledgeCard]:
        """Get cards by author ID."""
        query = (
            select(KnowledgeCard)
            .where(
                KnowledgeCard.author_id == author_id,
                KnowledgeCard.status == CardStatus.PUBLISHED.value
            )
            .order_by(KnowledgeCard.published_at.desc())
            .limit(limit)
        )
        if exclude_id:
            query = query.where(KnowledgeCard.id != exclude_id)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_featured(self, limit: int = 5) -> List[KnowledgeCard]:
        """Get featured cards."""
        result = await self.db.execute(
            select(KnowledgeCard)
            .where(
                KnowledgeCard.is_featured == True,
                KnowledgeCard.status == CardStatus.PUBLISHED.value
            )
            .order_by(KnowledgeCard.featured_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_series(
        self, 
        series_id: str,
        include_draft: bool = False
    ) -> List[KnowledgeCard]:
        """Get all cards in a series ordered by chapter index."""
        query = (
            select(KnowledgeCard)
            .where(KnowledgeCard.series_id == series_id)
            .order_by(KnowledgeCard.chapter_index.asc())
        )
        if not include_draft:
            query = query.where(KnowledgeCard.status == CardStatus.PUBLISHED.value)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def increment_stat(self, card_id: str, stat: str, delta: int = 1) -> bool:
        """Increment a card statistic."""
        if stat not in ('views', 'likes', 'comments', 'collects', 'shares'):
            return False
        
        column = getattr(KnowledgeCard, stat)
        result = await self.db.execute(
            update(KnowledgeCard)
            .where(KnowledgeCard.id == card_id)
            .values({stat: column + delta})
        )
        return result.rowcount > 0

    async def update_word_count(self, card_id: str, word_count: int, reading_time: int) -> bool:
        """Update word count and reading time."""
        result = await self.db.execute(
            update(KnowledgeCard)
            .where(KnowledgeCard.id == card_id)
            .values(word_count=word_count, reading_time=reading_time)
        )
        return result.rowcount > 0

    async def publish(self, card_id: str) -> bool:
        """Publish a card."""
        result = await self.db.execute(
            update(KnowledgeCard)
            .where(KnowledgeCard.id == card_id)
            .values(
                status=CardStatus.PUBLISHED.value,
                published_at=datetime.utcnow()
            )
        )
        return result.rowcount > 0

    async def feature(self, card_id: str, featured: bool = True) -> bool:
        """Set featured status."""
        result = await self.db.execute(
            update(KnowledgeCard)
            .where(KnowledgeCard.id == card_id)
            .values(
                is_featured=featured,
                featured_at=datetime.utcnow() if featured else None
            )
        )
        return result.rowcount > 0


class TagRepository:
    """Repository for Tag data access."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create(self, name: str) -> Tag:
        """Get or create a tag by name."""
        result = await self.db.execute(
            select(Tag).where(Tag.name == name)
        )
        tag = result.scalar_one_or_none()
        
        if not tag:
            tag = Tag(name=name, slug=self._generate_slug(name))
            self.db.add(tag)
            await self.db.flush()
        
        return tag

    async def get_by_id(self, tag_id: str) -> Optional[Tag]:
        """Get a tag by ID."""
        result = await self.db.execute(
            select(Tag).where(Tag.id == tag_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Optional[Tag]:
        """Get a tag by name."""
        result = await self.db.execute(
            select(Tag).where(Tag.name == name)
        )
        return result.scalar_one_or_none()

    async def get_all(self, limit: int = 50, min_usage: int = 0) -> List[Tag]:
        """Get all tags, optionally filtered by minimum usage."""
        query = select(Tag)
        if min_usage > 0:
            query = query.where(Tag.usage_count >= min_usage)
        query = query.order_by(Tag.usage_count.desc()).limit(limit)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_card_tags(self, card_id: str) -> List[Tag]:
        """Get tags for a specific card."""
        result = await self.db.execute(
            select(Tag)
            .join(CardTag, Tag.id == CardTag.tag_id)
            .where(CardTag.card_id == card_id)
        )
        return list(result.scalars().all())

    async def add_tags_to_card(self, card_id: str, tag_names: List[str]) -> None:
        """Add tags to a card."""
        for name in tag_names:
            tag = await self.get_or_create(name)
            # Check if association already exists
            existing = await self.db.execute(
                select(CardTag).where(
                    CardTag.card_id == card_id,
                    CardTag.tag_id == tag.id
                )
            )
            if not existing.scalar_one_or_none():
                card_tag = CardTag(card_id=card_id, tag_id=tag.id)
                self.db.add(card_tag)
                tag.usage_count += 1
        
        await self.db.flush()

    async def remove_tags_from_card(self, card_id: str, tag_ids: List[str] = None) -> None:
        """Remove tags from a card. If tag_ids is None, remove all."""
        if tag_ids:
            # Get tags to decrement usage count
            result = await self.db.execute(
                select(CardTag).where(
                    CardTag.card_id == card_id,
                    CardTag.tag_id.in_(tag_ids)
                )
            )
            card_tags = result.scalars().all()
            for ct in card_tags:
                tag = await self.get_by_id(ct.tag_id)
                if tag and tag.usage_count > 0:
                    tag.usage_count -= 1
            
            await self.db.execute(
                delete(CardTag).where(
                    CardTag.card_id == card_id,
                    CardTag.tag_id.in_(tag_ids)
                )
            )
        else:
            # Remove all and decrement usage
            result = await self.db.execute(
                select(CardTag).where(CardTag.card_id == card_id)
            )
            card_tags = result.scalars().all()
            for ct in card_tags:
                tag = await self.get_by_id(ct.tag_id)
                if tag and tag.usage_count > 0:
                    tag.usage_count -= 1
            
            await self.db.execute(
                delete(CardTag).where(CardTag.card_id == card_id)
            )
        
        await self.db.flush()

    async def set_card_tags(self, card_id: str, tag_names: List[str]) -> None:
        """Set tags for a card (replace existing)."""
        await self.remove_tags_from_card(card_id)
        if tag_names:
            await self.add_tags_to_card(card_id, tag_names)

    def _generate_slug(self, name: str) -> str:
        """Generate a slug from a tag name."""
        slug = name.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug)
        return slug[:60]


class SeriesRepository:
    """Repository for Series data access."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, series: Series) -> Series:
        """Create a new series."""
        self.db.add(series)
        await self.db.flush()
        await self.db.refresh(series)
        return series

    async def get_by_id(self, series_id: str) -> Optional[Series]:
        """Get a series by ID."""
        result = await self.db.execute(
            select(Series).where(Series.id == series_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Series]:
        """Get a series by slug."""
        result = await self.db.execute(
            select(Series).where(Series.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_list(
        self,
        page: int = 1,
        page_size: int = 10,
        author_id: Optional[str] = None,
        is_published: bool = True
    ) -> Tuple[List[Series], int]:
        """Get paginated list of series."""
        query = select(Series)
        
        if is_published:
            query = query.where(Series.is_published == True)
        if author_id:
            query = query.where(Series.author_id == author_id)
        
        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0
        
        # Paginate
        query = query.order_by(Series.updated_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        result = await self.db.execute(query)
        series_list = list(result.scalars().all())
        
        return series_list, total

    async def update(self, series: Series) -> Series:
        """Update a series."""
        await self.db.flush()
        await self.db.refresh(series)
        return series

    async def delete(self, series_id: str) -> bool:
        """Delete a series."""
        result = await self.db.execute(
            delete(Series).where(Series.id == series_id)
        )
        return result.rowcount > 0

    async def update_chapter_count(self, series_id: str) -> None:
        """Update the chapter count for a series."""
        result = await self.db.execute(
            select(func.count())
            .select_from(KnowledgeCard)
            .where(
                KnowledgeCard.series_id == series_id,
                KnowledgeCard.status == CardStatus.PUBLISHED.value
            )
        )
        count = result.scalar() or 0
        
        await self.db.execute(
            update(Series)
            .where(Series.id == series_id)
            .values(total_chapters=count)
        )


class CategoryRepository:
    """Repository for Category data access."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, category_id: str) -> Optional[Category]:
        """Get a category by ID."""
        result = await self.db.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Category]:
        """Get a category by slug."""
        result = await self.db.execute(
            select(Category).where(Category.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_tree(self) -> List[Category]:
        """Get all categories as a tree structure."""
        result = await self.db.execute(
            select(Category)
            .where(Category.parent_id == None)
            .order_by(Category.sort_order)
        )
        return list(result.scalars().all())

    async def get_all(self) -> List[Category]:
        """Get all categories flat list."""
        result = await self.db.execute(
            select(Category).order_by(Category.sort_order)
        )
        return list(result.scalars().all())


class UserInteractionRepository:
    """Repository for user-card interactions."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_interactions(
        self, 
        user_id: str, 
        card_id: str
    ) -> List[UserCardInteraction]:
        """Get all interactions for a user and card."""
        result = await self.db.execute(
            select(UserCardInteraction).where(
                UserCardInteraction.user_id == user_id,
                UserCardInteraction.card_id == card_id
            )
        )
        return list(result.scalars().all())

    async def get_interaction(
        self, 
        user_id: str, 
        card_id: str, 
        interaction_type: str
    ) -> Optional[UserCardInteraction]:
        """Get a specific interaction."""
        result = await self.db.execute(
            select(UserCardInteraction).where(
                UserCardInteraction.user_id == user_id,
                UserCardInteraction.card_id == card_id,
                UserCardInteraction.interaction_type == interaction_type
            )
        )
        return result.scalar_one_or_none()

    async def toggle_interaction(
        self, 
        user_id: str, 
        card_id: str, 
        interaction_type: str
    ) -> Tuple[bool, int]:
        """
        Toggle an interaction (like/collect/share).
        Returns (is_active, total_count).
        """
        existing = await self.get_interaction(user_id, card_id, interaction_type)
        
        if existing:
            # Remove interaction
            await self.db.delete(existing)
            await self.db.flush()
            is_active = False
        else:
            # Add interaction
            interaction = UserCardInteraction(
                user_id=user_id,
                card_id=card_id,
                interaction_type=interaction_type
            )
            self.db.add(interaction)
            await self.db.flush()
            is_active = True
        
        # Get total count
        count_result = await self.db.execute(
            select(func.count()).select_from(UserCardInteraction).where(
                UserCardInteraction.card_id == card_id,
                UserCardInteraction.interaction_type == interaction_type
            )
        )
        total_count = count_result.scalar() or 0
        
        return is_active, total_count

    async def get_user_liked_cards(self, user_id: str, limit: int = 20) -> List[str]:
        """Get card IDs liked by a user."""
        result = await self.db.execute(
            select(UserCardInteraction.card_id)
            .where(
                UserCardInteraction.user_id == user_id,
                UserCardInteraction.interaction_type == "like"
            )
            .order_by(UserCardInteraction.created_at.desc())
            .limit(limit)
        )
        return [row[0] for row in result.all()]

    async def get_user_collected_cards(self, user_id: str, limit: int = 20) -> List[str]:
        """Get card IDs collected by a user."""
        result = await self.db.execute(
            select(UserCardInteraction.card_id)
            .where(
                UserCardInteraction.user_id == user_id,
                UserCardInteraction.interaction_type == "collect"
            )
            .order_by(UserCardInteraction.created_at.desc())
            .limit(limit)
        )
        return [row[0] for row in result.all()]

    async def get_user_interaction_info(
        self, 
        user_id: str, 
        card_id: str
    ) -> dict:
        """Get user interaction info for a card."""
        interactions = await self.get_user_interactions(user_id, card_id)
        interaction_types = {i.interaction_type for i in interactions}
        
        return {
            "is_liked": "like" in interaction_types,
            "is_collected": "collect" in interaction_types,
            "is_shared": "share" in interaction_types,
        }


class CardVersionRepository:
    """Repository for card version history."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_version(
        self, 
        card: KnowledgeCard, 
        edited_by: str,
        edit_message: Optional[str] = None
    ) -> CardVersion:
        """Create a new version snapshot."""
        version = CardVersion(
            card_id=card.id,
            version=card.version,
            title=card.title,
            description=card.description,
            content=card.content,
            edited_by=edited_by,
            edit_message=edit_message
        )
        self.db.add(version)
        await self.db.flush()
        return version

    async def get_versions(
        self, 
        card_id: str, 
        limit: int = 10
    ) -> List[CardVersion]:
        """Get version history for a card."""
        result = await self.db.execute(
            select(CardVersion)
            .where(CardVersion.card_id == card_id)
            .order_by(CardVersion.version.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_version(self, card_id: str, version: int) -> Optional[CardVersion]:
        """Get a specific version of a card."""
        result = await self.db.execute(
            select(CardVersion).where(
                CardVersion.card_id == card_id,
                CardVersion.version == version
            )
        )
        return result.scalar_one_or_none()


class ReadingHistoryRepository:
    """Repository for reading history."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def record_reading(
        self,
        user_id: str,
        card_id: str,
        read_duration: int = 0,
        read_progress: float = 0.0
    ) -> ReadingHistory:
        """Record or update reading history."""
        # Check for existing record today
        result = await self.db.execute(
            select(ReadingHistory).where(
                ReadingHistory.user_id == user_id,
                ReadingHistory.card_id == card_id,
            ).order_by(ReadingHistory.created_at.desc()).limit(1)
        )
        history = result.scalar_one_or_none()
        
        if history:
            # Update existing
            history.read_duration = max(history.read_duration, read_duration)
            history.read_progress = max(history.read_progress, read_progress)
        else:
            # Create new
            history = ReadingHistory(
                user_id=user_id,
                card_id=card_id,
                read_duration=read_duration,
                read_progress=read_progress
            )
            self.db.add(history)
        
        await self.db.flush()
        return history

    async def get_user_history(
        self, 
        user_id: str, 
        limit: int = 20
    ) -> List[ReadingHistory]:
        """Get reading history for a user."""
        result = await self.db.execute(
            select(ReadingHistory)
            .where(ReadingHistory.user_id == user_id)
            .order_by(ReadingHistory.updated_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
