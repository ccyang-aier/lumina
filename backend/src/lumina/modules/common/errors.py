"""
Application error handling.
"""

from enum import Enum
from typing import Any, Dict, Optional

from litestar.exceptions import HTTPException


class ErrorCode(str, Enum):
    """Application error codes."""

    # Authentication errors
    UNAUTHORIZED = "UNAUTHORIZED"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    PERMISSION_DENIED = "PERMISSION_DENIED"

    # Resource errors
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
    RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS"

    # Validation errors
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_INPUT = "INVALID_INPUT"

    # Business logic errors
    OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED"
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED"

    # Server errors
    INTERNAL_ERROR = "INTERNAL_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"


class AppException(HTTPException):
    """Application-specific exception."""

    def __init__(
        self,
        status_code: int,
        code: ErrorCode,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.code = code
        self.details = details or {}
        super().__init__(status_code=status_code, detail=message)

    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary."""
        return {
            "success": False,
            "error": {
                "code": self.code.value,
                "message": self.detail,
                "details": self.details,
            },
        }


# Common exceptions
class NotFoundError(AppException):
    """Resource not found exception."""

    def __init__(self, resource: str, identifier: str):
        super().__init__(
            status_code=404,
            code=ErrorCode.RESOURCE_NOT_FOUND,
            message=f"{resource} with id '{identifier}' not found",
        )


class UnauthorizedError(AppException):
    """Unauthorized access exception."""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            status_code=401,
            code=ErrorCode.UNAUTHORIZED,
            message=message,
        )


class ForbiddenError(AppException):
    """Forbidden access exception."""

    def __init__(self, message: str = "Permission denied"):
        super().__init__(
            status_code=403,
            code=ErrorCode.PERMISSION_DENIED,
            message=message,
        )


class ValidationError(AppException):
    """Validation error exception."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=400,
            code=ErrorCode.VALIDATION_ERROR,
            message=message,
            details=details,
        )
