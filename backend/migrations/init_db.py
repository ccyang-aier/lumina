"""
Database Initialization Script
Run this script to create all database tables
"""

import asyncio
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

from src.lumina.infra.db import engine, Base, init_db
from src.lumina.modules.auth.domain import User
from src.lumina.modules.cards.domain import (
    KnowledgeCard,
    Series,
    Tag,
    CardTag,
    Category,
    UserCardInteraction,
    CardVersion,
    ReadingHistory,
)
from src.lumina.modules.cards.domain.comment import Comment, Like


async def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    
    async with engine.begin() as conn:
        # Import all models to ensure they are registered
        # Drop all tables (for development)
        # await conn.run_sync(Base.metadata.drop_all)
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database tables created successfully!")


async def create_default_data():
    """Create default data for development."""
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy.orm import sessionmaker
    from src.lumina.modules.auth.domain import User, UserRole, UserStatus
    import uuid
    
    print("Creating default data...")
    
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Check if default user exists
        from sqlalchemy import select
        
        result = await session.execute(
            select(User).where(User.email == "demo@lumina.local")
        )
        if not result.scalar_one_or_none():
            # Create default demo user
            user = User(
                id=str(uuid.uuid4()),
                email="demo@lumina.local",
                username="DemoUser",
                hashed_password=hash_password("demo123456"),
                full_name="Demo User",
                bio="Welcome to Lumina!",
                role=UserRole.USER.value,
                status=UserStatus.ACTIVE.value,
            )
            session.add(user)
            await session.commit()
            print(f"Created demo user: {user.username} (password: demo123456)")
        
        # Create admin user
        result = await session.execute(
            select(User).where(User.email == "admin@lumina.local")
        )
        if not result.scalar_one_or_none():
            admin = User(
                id=str(uuid.uuid4()),
                email="admin@lumina.local",
                username="Admin",
                hashed_password=hash_password("admin123456"),
                full_name="System Administrator",
                role=UserRole.ADMIN.value,
                status=UserStatus.ACTIVE.value,
                is_superuser=True,
            )
            session.add(admin)
            await session.commit()
            print(f"Created admin user: {admin.username} (password: admin123456)")
    
    print("Default data created successfully!")


def hash_password(password: str) -> str:
    """Hash password using SHA256."""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


async def main():
    """Main entry point."""
    print("=" * 50)
    print("Lumina Database Initialization")
    print("=" * 50)
    
    await create_tables()
    await create_default_data()
    
    print("\nDatabase initialization complete!")
    print("\nDefault credentials:")
    print("  Demo User: demo@lumina.local / demo123456")
    print("  Admin User: admin@lumina.local / admin123456")


if __name__ == "__main__":
    asyncio.run(main())
