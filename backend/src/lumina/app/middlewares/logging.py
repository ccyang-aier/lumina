"""
Logging Middleware
Logs all incoming requests and outgoing responses.
"""

from litestar import Request, Response
from litestar.middleware import AbstractMiddleware
from loguru import logger
import time
import uuid


class LoggingMiddleware(AbstractMiddleware):
    """Middleware for logging HTTP requests and responses."""

    async def __call__(self, request: Request, call_next):
        """Process request and log details."""

        # Generate request ID
        request_id = str(uuid.uuid4())[:8]

        # Log request
        logger.info(
            f"[{request_id}] Request: {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )

        # Time the request
        start_time = time.time()

        # Process request
        response: Response = await call_next(request)

        # Calculate duration
        duration = time.time() - start_time

        # Log response
        logger.info(
            f"[{request_id}] Response: {response.status_code} "
            f"in {duration:.3f}s"
        )

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id

        return response
