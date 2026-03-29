"""
Logging Configuration using Loguru
"""

import sys
from pathlib import Path

from loguru import logger

# Remove default handler
logger.remove()

# Add custom handler with format
log_format = (
    "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
    "<level>{message}</level>"
)

# Console handler
logger.add(
    sys.stdout,
    format=log_format,
    level="DEBUG",
    colorize=True,
    backtrace=True,
    diagnose=True,
)

# File handler for errors
log_path = Path(__file__).parent.parent.parent.parent.parent / "logs"
log_path.mkdir(exist_ok=True)

logger.add(
    log_path / "error.log",
    format=log_format,
    level="ERROR",
    rotation="10 MB",
    retention="7 days",
    compression="zip",
    backtrace=True,
    diagnose=True,
)

# File handler for all logs
logger.add(
    log_path / "lumina.log",
    format=log_format,
    level="INFO",
    rotation="50 MB",
    retention="30 days",
    compression="zip",
)


def get_logger():
    """Get the configured logger instance."""
    return logger


# Export logger instance
__all__ = ["logger", "get_logger"]
