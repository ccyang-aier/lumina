"""
Comment API Routes
"""

from typing import Annotated, Optional
from litestar import Router, get, post, put, delete
from litestar.params import Parameter
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import (
    CommentCreate,
    CommentUpdate,
    CommentRead,
    CommentListResponse,
    LikeResponse,
)
from ..service import CommentService
from ....app.dependencies import provide_session
from ....modules.common.errors import NotFoundError


class CommentListResponseWrapper(BaseModel):
    """Response wrapper for comment list."""
    success: bool = True
    data: CommentListResponse


@get("/{card_id:str}/comments", summary="List Comments", description="Get comments for a knowledge card")
async def list_comments(
    card_id: str,
    db: Annotated[AsyncSession, "db_session"],
    page: int = Parameter(default=1, ge=1),
    page_size: int = Parameter(default=10, ge=1, le=50),
    sort_by: str = Parameter(default="hot"),
) -> CommentListResponseWrapper:
    """List comments for a card with pagination."""
    service = CommentService(db)
    
    comments, total = await service.get_comments_by_card(
        card_id=card_id,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
    )
    
    # Build comment tree with replies
    items = []
    for comment in comments:
        comment_read = await service.build_comment_tree(comment)
        items.append(comment_read)
    
    return CommentListResponseWrapper(
        data=CommentListResponse(items=items, total=total)
    )


@post("/{card_id:str}/comments", summary="Create Comment", description="Create a new comment")
async def create_comment(
    card_id: str,
    data: CommentCreate,
    db: Annotated[AsyncSession, "db_session"],
) -> CommentRead:
    """Create a new comment on a card."""
    service = CommentService(db)
    
    # TODO: Get author_id from authenticated user
    author_id = "placeholder-user-id"
    
    comment = await service.create_comment(card_id, author_id, data)
    return await service.build_comment_tree(comment)


@put("/comments/{comment_id:str}", summary="Update Comment", description="Update an existing comment")
async def update_comment(
    comment_id: str,
    data: CommentUpdate,
    db: Annotated[AsyncSession, "db_session"],
) -> CommentRead:
    """Update a comment."""
    service = CommentService(db)
    
    # TODO: Get user_id from authenticated user
    user_id = "placeholder-user-id"
    
    comment = await service.update_comment(comment_id, user_id, data)
    if not comment:
        raise NotFoundError("Comment", comment_id)
    
    return await service.build_comment_tree(comment)


@delete("/comments/{comment_id:str}", summary="Delete Comment", description="Delete a comment", status_code=200)
async def delete_comment(
    comment_id: str,
    db: Annotated[AsyncSession, "db_session"],
) -> dict:
    """Delete a comment."""
    service = CommentService(db)
    
    # TODO: Get user_id from authenticated user
    user_id = "placeholder-user-id"
    
    success = await service.delete_comment(comment_id, user_id)
    if not success:
        raise NotFoundError("Comment", comment_id)
    
    return {"success": True, "message": "Comment deleted successfully"}


@post("/comments/{comment_id:str}/like", summary="Toggle Like", description="Toggle like on a comment")
async def toggle_comment_like(
    comment_id: str,
    db: Annotated[AsyncSession, "db_session"],
) -> LikeResponse:
    """Toggle like on a comment."""
    service = CommentService(db)
    
    # TODO: Get user_id from authenticated user
    user_id = "placeholder-user-id"
    
    return await service.toggle_like(comment_id, user_id)


# Router
router = Router(
    path="/cards",
    route_handlers=[
        list_comments,
        create_comment,
        update_comment,
        delete_comment,
        toggle_comment_like,
    ],
)
