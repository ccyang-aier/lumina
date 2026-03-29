"""
Knowledge Card Service Layer
Complete business logic implementation
"""

import re
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import (
    KnowledgeCard,
    Series,
    CardType,
    CardStatus,
    CardStats,
    CardLocation,
    AuthorBrief,
    UserInteractionInfo,
    KnowledgeCardCreate,
    KnowledgeCardUpdate,
    KnowledgeCardRead,
    KnowledgeCardBrief,
    KnowledgeCardListResponse,
    CardQueryParams,
    CardInteractionCreate,
    CardInteractionResponse,
    SeriesRead,
    SeriesChapter,
    SeriesGroup,
    SeriesCreate,
    SeriesUpdate,
    SeriesListResponse,
)
from ..infra import (
    CardRepository,
    SeriesRepository,
    TagRepository,
    CategoryRepository,
    UserInteractionRepository,
    CardVersionRepository,
)


class KnowledgeCardService:
    """Service for knowledge card business logic."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.card_repo = CardRepository(db)
        self.tag_repo = TagRepository(db)
        self.series_repo = SeriesRepository(db)
        self.category_repo = CategoryRepository(db)
        self.interaction_repo = UserInteractionRepository(db)
        self.version_repo = CardVersionRepository(db)

    async def create_card(
        self, 
        data: KnowledgeCardCreate, 
        author_id: str
    ) -> KnowledgeCard:
        """Create a new knowledge card."""
        # Calculate word count and reading time
        word_count = 0
        reading_time = 0
        if data.content:
            word_count = self._count_words(data.content)
            reading_time = max(1, word_count // 200)  # ~200 words per minute
        
        # Create card
        card = KnowledgeCard(
            title=data.title,
            slug=self._generate_slug(data.title),
            description=data.description,
            content=data.content,
            image=data.image,
            type=data.type.value,
            domain=data.domain,
            author_id=author_id,
            series_id=data.series_id,
            chapter_title=data.chapter_title,
            chapter_index=data.chapter_index,
            status=data.status.value if data.status else CardStatus.DRAFT.value,
            word_count=word_count,
            reading_time=reading_time,
            meta_title=data.meta_title,
            meta_description=data.meta_description,
        )
        
        # Handle publishing
        if data.status == CardStatus.PUBLISHED:
            card.published_at = datetime.utcnow()
        
        card = await self.card_repo.create(card)
        
        # Handle tags
        if data.tags:
            await self.tag_repo.set_card_tags(card.id, data.tags)
        
        
        # Update series chapter count
        if data.series_id:
            await self.series_repo.update_chapter_count(data.series_id)
        
        
        await self.db.commit()
        return card

    async def get_card_by_id(
        self, 
        card_id: str, 
        user_id: Optional[str] = None,
        increment_view: bool = True
    ) -> Optional[KnowledgeCard]:
        """Get a knowledge card by ID."""
        return await self.card_repo.get_by_id(
            card_id, 
            increment_view=increment_view
        )

    async def get_card_detail(
        self, 
        card_id: str,
        user_id: Optional[str] = None
    ) -> Optional[Tuple[KnowledgeCard, List[str], Optional[Series], dict]]:
        """Get card with all related data for detail view."""
        card = await self.card_repo.get_by_id(card_id, increment_view=True)
        if not card:
            return None
        
        # Get tags
        tags = await self.get_card_tags(card.id)
        
        # Get series
        series = None
        if card.series_id:
            series = await self.series_repo.get_by_id(card.series_id)
        
        # Get user interaction info
        interaction_info = {}
        if user_id:
            interaction_info = await self.interaction_repo.get_user_interaction_info(
                user_id, card.id
            )
        
        
        return card, tags, series, interaction_info

    async def get_cards(
        self,
        params: CardQueryParams,
        user_id: Optional[str] = None
    ) -> Tuple[List[KnowledgeCard], int]:
        """Get paginated list of knowledge cards with filters."""
        return await self.card_repo.get_list(params, user_id)

    async def update_card(
        self, 
        card_id: str, 
        data: KnowledgeCardUpdate, 
        user_id: str,
        create_version: bool = True
    ) -> Optional[KnowledgeCard]:
        """Update a knowledge card."""
        card = await self.card_repo.get_by_id(card_id, increment_view=False)
        if not card:
            return None
        
        # Authorization check
        if card.author_id != user_id:
            return None
        
        # Create version snapshot before update
        if create_version and data.content and card.content != data.content:
            await self.version_repo.create_version(card, user_id)
            card.version += 1
        
        
        # Update fields
        update_data = data.model_dump(exclude_unset=True, exclude={"tags"})
        
        for key, value in update_data.items():
            setattr(card, key, value)
        
        
        # Handle status change
        if data.status == CardStatus.PUBLISHED and not card.published_at:
            card.published_at = datetime.utcnow()
        
        
        # Recalculate word count if content changed
        if data.content:
            card.word_count = self._count_words(data.content)
            card.reading_time = max(1, card.word_count // 200)
        
        
        # Handle tags
        if data.tags is not None:
            await self.tag_repo.set_card_tags(card_id, data.tags)
        
        
        # Update slug if title changed
        if data.title:
            card.slug = self._generate_slug(data.title)
        
        card = await self.card_repo.update(card)
        
        # Update series chapter count if series changed
        if data.series_id is not None:
            if card.series_id:
                await self.series_repo.update_chapter_count(card.series_id)
            if data.series_id:
                await self.series_repo.update_chapter_count(data.series_id)
        
        
        await self.db.commit()
        return card

    async def delete_card(self, card_id: str, user_id: str) -> bool:
        """Soft delete a knowledge card."""
        card = await self.card_repo.get_by_id(card_id, increment_view=False)
        if not card:
            return False
        
        # Authorization check
        if card.author_id != user_id:
            return False
        
        success = await self.card_repo.delete(card_id)
        
        # Update series chapter count
        if card.series_id:
            await self.series_repo.update_chapter_count(card.series_id)
        
        
        await self.db.commit()
        return success

    async def toggle_interaction(
        self,
        card_id: str,
        user_id: str,
        data: CardInteractionCreate
    ) -> Optional[CardInteractionResponse]:
        """Toggle user interaction (like/collect/share)."""
        card = await self.card_repo.get_by_id(card_id, increment_view=False)
        if not card:
            return None
        
        is_active, total_count = await self.interaction_repo.toggle_interaction(
            user_id, card_id, data.interaction_type
        )
        
        # Update card statistics
        stat_map = {
            "like": "likes",
            "collect": "collects",
            "share": "shares"
        }
        stat_field = stat_map.get(data.interaction_type)
        if stat_field:
            delta = 1 if is_active else -1
            await self.card_repo.increment_stat(card_id, stat_field, delta)
        
        
        await self.db.commit()
        
        return CardInteractionResponse(
            interaction_type=data.interaction_type,
            is_active=is_active,
            count=total_count
        )

    async def get_card_tags(self, card_id: str) -> List[str]:
        """Get tag names for a card."""
        tags = await self.tag_repo.get_card_tags(card_id)
        return [tag.name for tag in tags]

    async def get_featured_cards(self, limit: int = 5) -> List[KnowledgeCard]:
        """Get featured cards."""
        return await self.card_repo.get_featured(limit)

    async def get_author_cards(
        self, 
        author_id: str, 
        exclude_id: Optional[str] = None,
        limit: int = 5
    ) -> List[KnowledgeCard]:
        """Get other cards by the same author."""
        return await self.card_repo.get_by_author(author_id, limit, exclude_id)

    async def publish_card(self, card_id: str, user_id: str) -> Optional[KnowledgeCard]:
        """Publish a draft card."""
        card = await self.card_repo.get_by_id(card_id, increment_view=False)
        if not card or card.author_id != user_id:
            return None
        
        await self.card_repo.publish(card_id)
        
        # Update series chapter count
        if card.series_id:
            await self.series_repo.update_chapter_count(card.series_id)
        
        await self.db.commit()
        return await self.card_repo.get_by_id(card_id)

    async def feature_card(
        self, 
        card_id: str, 
        featured: bool = True
    ) -> Optional[KnowledgeCard]:
        """Feature or unfeature a card."""
        card = await self.card_repo.get_by_id(card_id, increment_view=False)
        if not card:
            return None
        
        await self.card_repo.feature(card_id, featured)
        await self.db.commit()
        return await self.card_repo.get_by_id(card_id)

    def to_brief(
        self, 
        card: KnowledgeCard, 
        tags: List[str] = None,
        author: Optional[dict] = None
    ) -> KnowledgeCardBrief:
        """Convert card model to brief schema."""
        author_brief = AuthorBrief(
            name=author.get("username", "Unknown") if author else "Unknown",
            avatar=author.get("avatar") if author else None,
            guild=author.get("guild") if author else None,
        )
        return KnowledgeCardBrief(
            id=card.id,
            title=card.title,
            description=card.description,
            image=card.image,
            tags=tags or [],
            domain=card.domain,
            author=author_brief,
            type=card.type,
            stats=CardStats(
                views=card.views,
                likes=card.likes,
                comments=card.comments,
                collects=card.collects,
                shares=card.shares,
            ),
            publishDate=card.published_at.strftime("%Y-%m-%d") if card.published_at else "",
            reading_time=card.reading_time,
        )

    def to_read(
        self, 
        card: KnowledgeCard, 
        author: Optional[dict] = None,
        tags: List[str] = None,
        series: Optional[Series] = None,
        user_interaction: Optional[dict] = None
    ) -> KnowledgeCardRead:
        """Convert card model to full read schema."""
        author_brief = AuthorBrief(
            name=author.get("username", "Unknown") if author else "Unknown",
            avatar=author.get("avatar") if author else None,
            guild=author.get("guild") if author else None,
            bio=author.get("bio", "")[:100] if author and author.get("bio") else None,
        )
        
        location = None
        if card.series_id and card.chapter_title:
            location = CardLocation(
                series=series.title if series else "",
                seriesId=card.series_id,
                chapter=card.chapter_title,
                chapterIndex=card.chapter_index or 0,
            )
        
        
        user_interaction_info = None
        if user_interaction:
            user_interaction_info = UserInteractionInfo(**user_interaction)
        
        return KnowledgeCardRead(
            id=card.id,
            title=card.title,
            description=card.description,
            image=card.image,
            tags=tags or [],
            domain=card.domain,
            author=author_brief,
            type=card.type,
            content=card.content,
            stats=CardStats(
                views=card.views,
                likes=card.likes,
                comments=card.comments,
                collects=card.collects,
                shares=card.shares,
            ),
            location=location,
            status=card.status,
            publishDate=card.published_at.strftime("%Y-%m-%d") if card.published_at else "",
            reading_time=card.reading_time,
            word_count=card.word_count,
            version=card.version,
            user_interaction=user_interaction_info,
        )

    def _generate_slug(self, title: str) -> str:
        """Generate a URL-friendly slug from title."""
        slug = title.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug)
        slug = slug.strip('-')
        return slug[:280]

    def _count_words(self, content: str) -> int:
        """Count words in content, handling CJK characters."""
        if not content:
            return 0
        # Remove code blocks
        content = re.sub(r'```[\s\S]*?```', '', content)
        # Count CJK characters
        cjk_count = len(re.findall(r'[\u4e00-\u9fff\u3040-\u30ff]', content))
        # Count other words
        other_words = len(re.findall(r'\b[a-zA-Z]+\b', content))
        return cjk_count + other_words


class SeriesService:
    """Service for series business logic."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.series_repo = SeriesRepository(db)
        self.card_repo = CardRepository(db)

    async def create_series(
        self, 
        data: SeriesCreate, 
        author_id: str
    ) -> Series:
        """Create a new series."""
        series = Series(
            title=data.title,
            slug=self._generate_slug(data.title),
            description=data.description,
            cover_image=data.cover_image,
            level=data.level,
            groups=data.groups,
            author_id=author_id,
        )
        
        series = await self.series_repo.create(series)
        await self.db.commit()
        return series

    async def get_series_by_id(self, series_id: str) -> Optional[Series]:
        """Get a series by ID."""
        return await self.series_repo.get_by_id(series_id)

    async def get_series_cards(self, series_id: str) -> List[KnowledgeCard]:
        """Get all cards in a series."""
        return await self.card_repo.get_by_series(series_id)

    async def get_series_list(
        self,
        page: int = 1,
        page_size: int = 10,
        author_id: Optional[str] = None
    ) -> Tuple[List[Series], int]:
        """Get paginated list of series."""
        return await self.series_repo.get_list(page, page_size, author_id)

    async def update_series(
        self, 
        series_id: str, 
        data: SeriesUpdate,
        user_id: str
    ) -> Optional[Series]:
        """Update a series."""
        series = await self.series_repo.get_by_id(series_id)
        if not series or series.author_id != user_id:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(series, key, value)
        
        if data.title:
            series.slug = self._generate_slug(data.title)
        
        series = await self.series_repo.update(series)
        await self.db.commit()
        return series

    async def delete_series(self, series_id: str, user_id: str) -> bool:
        """Delete a series."""
        series = await self.series_repo.get_by_id(series_id)
        if not series or series.author_id != user_id:
            return False
        
        success = await self.series_repo.delete(series_id)
        await self.db.commit()
        return success

    def to_read(
        self, 
        series: Series, 
        cards: List[KnowledgeCard] = None
    ) -> SeriesRead:
        """Convert series model to read schema."""
        card_list = []
        groups = []
        
        if cards:
            card_list = [
                SeriesChapter(
                    id=str(c.id),
                    title=c.title,
                    chapterIndex=c.chapter_index or i + 1,
                    chapter=c.chapter_title or f"第{i + 1}章",
                )
                for i, c in enumerate(cards)
            ]
            
            # Build groups if available
            if series.groups:
                for group_data in series.groups:
                    group_cards = [
                        SeriesChapter(
                            id=str(c.id),
                            title=c.title,
                            chapterIndex=c.chapter_index or idx,
                            chapter=c.chapter_title or "",
                        )
                        for idx, c in enumerate(cards)
                        if c.chapter_index and group_data.get("start") <= c.chapter_index <= group_data.get("end", 999)
                    ]
                    if group_cards:
                        groups.append(SeriesGroup(
                            id=group_data.get("id", ""),
                            title=group_data.get("title", ""),
                            icon=group_data.get("icon"),
                            chapters=group_cards,
                        ))
        
        return SeriesRead(
            id=series.id,
            title=series.title,
            description=series.description,
            cover_image=series.cover_image,
            totalChapters=series.total_chapters,
            level=series.level,
            cards=card_list,
            groups=groups if groups else None,
            lastUpdated=series.updated_at.strftime("%Y-%m-%d") if series.updated_at else None,
            total_views=series.total_views,
            total_likes=series.total_likes,
        )

    def _generate_slug(self, title: str) -> str:
        """Generate a URL-friendly slug from title."""
        slug = title.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug)
        return slug[:280]
