"""
Error Handler Middleware
Global error handling for the application.
"""

from litestar import Request, Response
from litestar.exceptions import HTTPException
from litestar.middleware import AbstractMiddleware
from loguru import logger
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Standard error response model."""

    error: str
    message: str
    status_code: int


class ErrorHandlerMiddleware(AbstractMiddleware):
    """Middleware for handling errors globally."""

    async def __call__(self, request: Request, call_next):
        """Process request and handle any errors."""
        try:
            return await call_next(request)

        except HTTPException as e:
            logger.error(f"HTTP Error: {e.status_code} - {e.detail}")
            return Response(
                content=ErrorResponse(
                    error="HTTPError",
                    message=str(e.detail),
                    status_code=e.status_code,
                ).model_dump(),
                status_code=e.status_code,
            )

        except Exception as e:
            logger.exception(f"Unhandled error: {str(e)}")
            return Response(
                content=ErrorResponse(
                    error="InternalServerError",
                    message="An unexpected error occurred",
                    status_code=500,
                ).model_dump(),
                status_code=500,
            )
