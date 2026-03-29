"""
Comment Service Layer
"""

from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from ...auth.domain import User
from ..domain import (
    Comment,
    Like,
    CommentImage,
    CommentAuthor,
    CommentCreate,
    CommentUpdate,
    CommentRead,
    CommentListResponse,
    LikeResponse,
)


class CommentService:
    """Service for comment operations."""

    # Hot comment threshold
    HOT_COMMENT_THRESHOLD = 10
    HOT_SCORE_WEIGHT_REPLY = 3

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_comment(
        self,
        card_id: str,
        author_id: str,
        data: CommentCreate,
    ) -> Comment:
        """Create a new comment."""
        comment = Comment(
            content=data.content,
            card_id=card_id,
            author_id=author_id,
            parent_id=data.parent_id,
            images=[img.model_dump() for img in data.images] if data.images else None,
            quote_text=data.quote_text,
        )
        
        self.db.add(comment)
        
        # Update parent's reply count
        if data.parent_id:
            parent = await self.get_comment_by_id(data.parent_id)
            if parent:
                parent.replies_count += 1
        
        await self.db.commit()
        await self.db.refresh(comment)
        
        return comment

    async def get_comment_by_id(self, comment_id: str) -> Optional[Comment]:
        """Get a comment by ID."""
        result = await self.db.execute(
            select(Comment).where(Comment.id == comment_id)
        )
        return result.scalar_one_or_none()

    async def get_comments_by_card(
        self,
        card_id: str,
        page: int = 1,
        page_size: int = 10,
        sort_by: str = "hot",  # 'hot' or 'latest'
        user_id: Optional[str] = None,
    ) -> Tuple[List[Comment], int]:
        """Get paginated comments for a card."""
        # Only get top-level comments (no parent)
        query = select(Comment).where(
            and_(
                Comment.card_id == card_id,
                Comment.parent_id.is_(None),
                Comment.is_deleted == False,
            )
        )
        
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0
        
        # Apply sorting
        if sort_by == "hot":
            query = query.order_by(Comment.hot_score.desc(), Comment.likes.desc())
        else:
            query = query.order_by(Comment.created_at.desc())
        
        # Apply pagination
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        result = await self.db.execute(query)
        comments = list(result.scalars().all())
        
        return comments, total

    async def get_replies(self, comment_id: str) -> List[Comment]:
        """Get replies for a comment."""
        result = await self.db.execute(
            select(Comment)
            .where(Comment.parent_id == comment_id)
            .where(Comment.is_deleted == False)
            .order_by(Comment.created_at.asc())
        )
        return list(result.scalars().all())

    async def toggle_like(
        self,
        comment_id: str,
        user_id: str,
    ) -> LikeResponse:
        """Toggle like on a comment."""
        comment = await self.get_comment_by_id(comment_id)
        if not comment:
            return LikeResponse(liked=False, likes_count=0)
        
        # Check if already liked
        result = await self.db.execute(
            select(Like).where(
                and_(
                    Like.user_id == user_id,
                    Like.target_type == "comment",
                    Like.target_id == comment_id,
                )
            )
        )
        existing_like = result.scalar_one_or_none()
        
        if existing_like:
            # Unlike
            await self.db.delete(existing_like)
            comment.likes = max(0, comment.likes - 1)
            liked = False
        else:
            # Like
            new_like = Like(
                user_id=user_id,
                target_type="comment",
                target_id=comment_id,
            )
            self.db.add(new_like)
            comment.likes += 1
            liked = True
        
        # Update hot score
        comment.hot_score = comment.likes + comment.replies_count * self.HOT_SCORE_WEIGHT_REPLY
        comment.is_hot = comment.hot_score >= self.HOT_COMMENT_THRESHOLD
        
        await self.db.commit()
        
        return LikeResponse(liked=liked, likes_count=comment.likes)

    async def update_comment(
        self,
        comment_id: str,
        user_id: str,
        data: CommentUpdate,
    ) -> Optional[Comment]:
        """Update a comment."""
        comment = await self.get_comment_by_id(comment_id)
        
        if not comment or comment.author_id != user_id:
            return None
        
        if data.content is not None:
            comment.content = data.content
        if data.images is not None:
            comment.images = [img.model_dump() for img in data.images]
        
        await self.db.commit()
        await self.db.refresh(comment)
        
        return comment

    async def delete_comment(self, comment_id: str, user_id: str) -> bool:
        """Soft delete a comment."""
        comment = await self.get_comment_by_id(comment_id)
        
        if not comment or comment.author_id != user_id:
            return False
        
        comment.is_deleted = True
        
        # Update parent's reply count
        if comment.parent_id:
            parent = await self.get_comment_by_id(comment.parent_id)
            if parent:
                parent.replies_count = max(0, parent.replies_count - 1)
        
        await self.db.commit()
        return True

    def to_read(
        self,
        comment: Comment,
        author: Optional[User] = None,
        is_liked: bool = False,
        replies: List[CommentRead] = None,
    ) -> CommentRead:
        """Convert comment model to read schema."""
        author_data = CommentAuthor(
            name=author.username if author else "Unknown",
            avatar=author.avatar if author else None,
            role="author" if author and hasattr(author, 'role') else "user",
        )
        
        images = None
        if comment.images:
            images = [CommentImage(id=img.get("id", ""), url=img.get("url", "")) 
                     for img in comment.images]
        
        return CommentRead(
            id=comment.id,
            content=comment.content,
            author=author_data,
            createdAt=comment.created_at,
            likes=comment.likes,
            isLiked=is_liked,
            replies=replies or [],
            images=images,
            isHot=comment.is_hot,
            hotScore=comment.hot_score,
            quoteText=comment.quote_text,
            parentId=comment.parent_id,
        )

    async def build_comment_tree(
        self,
        comment: Comment,
        user_id: Optional[str] = None,
        max_depth: int = 3,
        current_depth: int = 0,
    ) -> CommentRead:
        """Build a comment tree with nested replies."""
        # Get author
        result = await self.db.execute(
            select(User).where(User.id == comment.author_id)
        )
        author = result.scalar_one_or_none()
        
        # Check if liked by user
        is_liked = False
        if user_id:
            like_result = await self.db.execute(
                select(Like).where(
                    and_(
                        Like.user_id == user_id,
                        Like.target_type == "comment",
                        Like.target_id == comment.id,
                    )
                )
            )
            is_liked = like_result.scalar_one_or_none() is not None
        
        # Get replies if not at max depth
        replies = []
        if current_depth < max_depth:
            child_comments = await self.get_replies(comment.id)
            for child in child_comments:
                child_read = await self.build_comment_tree(
                    child, user_id, max_depth, current_depth + 1
                )
                replies.append(child_read)
        
        return self.to_read(comment, author, is_liked, replies)
