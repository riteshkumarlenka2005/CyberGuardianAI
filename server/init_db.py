
import asyncio
import sys
from pathlib import Path

# Add the server directory to sys.path so we can import from src
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from src.app.database import engine, AsyncSessionLocal, Base
from src.app.models.user import User  # Import all models to ensure they are registered
from src.app.models.progress import (
    UserProgress, TrainingSession, BadgeDefinition, UserBadge, DailyStat
)
from src.app.models.content import (
    GalleryItem, ResourceAlert, ResourceVideo, ResourceLink
)
from sqlalchemy import select, update, text

# Badge definitions to seed
BADGE_SEEDS = [
    {"badge_key": "first_session", "name": "First Steps", "icon": "🎯", "description": "Complete your first training session", "requirement_type": "sessions", "requirement_value": 1, "requirement_scenario_type": None},
    {"badge_key": "five_sessions", "name": "Dedicated Learner", "icon": "📚", "description": "Complete 5 training sessions", "requirement_type": "sessions", "requirement_value": 5, "requirement_scenario_type": None},
    {"badge_key": "ten_sessions", "name": "Safety Expert", "icon": "🛡️", "description": "Complete 10 training sessions", "requirement_type": "sessions", "requirement_value": 10, "requirement_scenario_type": None},
    {"badge_key": "bank_master", "name": "Banking Guardian", "icon": "🏦", "description": "Complete 3 bank fraud scenarios", "requirement_type": "scenario_type", "requirement_value": 3, "requirement_scenario_type": "BANK"},
    {"badge_key": "job_master", "name": "Recruitment Shield", "icon": "💼", "description": "Complete 3 job scam scenarios", "requirement_type": "scenario_type", "requirement_value": 3, "requirement_scenario_type": "JOB"},
    {"badge_key": "govt_master", "name": "Authority Detector", "icon": "🏛️", "description": "Complete 3 government impersonation scenarios", "requirement_type": "scenario_type", "requirement_value": 3, "requirement_scenario_type": "GOVERNMENT"},
    {"badge_key": "emergency_master", "name": "Crisis Calm", "icon": "🚨", "description": "Complete 3 family emergency scenarios", "requirement_type": "scenario_type", "requirement_value": 3, "requirement_scenario_type": "EMERGENCY"},
    {"badge_key": "three_tactics", "name": "Pattern Spotter", "icon": "👁️", "description": "Encounter 3 different manipulation tactics", "requirement_type": "tactics", "requirement_value": 3, "requirement_scenario_type": None},
    {"badge_key": "five_tactics", "name": "Manipulation Master", "icon": "🧠", "description": "Encounter 5 different manipulation tactics", "requirement_type": "tactics", "requirement_value": 5, "requirement_scenario_type": None},
    {"badge_key": "streak_3", "name": "Consistent Defender", "icon": "🔥", "description": "Train for 3 consecutive days", "requirement_type": "streak", "requirement_value": 3, "requirement_scenario_type": None},
    {"badge_key": "streak_7", "name": "Weekly Warrior", "icon": "⚡", "description": "Train for 7 consecutive days", "requirement_type": "streak", "requirement_value": 7, "requirement_scenario_type": None},
]

async def init_db():
    print("Connecting to PostgreSQL...")
    async with engine.begin() as conn:
        print("Creating tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
        # Add role column if missing (create_all doesn't alter existing tables)
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
            print("Added 'role' column to users.")
        except Exception:
            pass  # column already exists
    print("Tables created.")

    # Seed badge definitions
    print("Seeding badge definitions...")
    async with AsyncSessionLocal() as session:
        for badge_data in BADGE_SEEDS:
            result = await session.execute(
                select(BadgeDefinition).where(BadgeDefinition.badge_key == badge_data["badge_key"])
            )
            existing = result.scalar_one_or_none()
            if not existing:
                badge = BadgeDefinition(**badge_data)
                session.add(badge)
                print(f"  + Added badge: {badge_data['badge_key']}")
            else:
                print(f"  - Badge already exists: {badge_data['badge_key']}")
        await session.commit()

    # Set admin role for the owner account
    print("Setting admin role...")
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.email == "lenkariteshkumar2005@gmail.com")
        )
        admin_user = result.scalar_one_or_none()
        if admin_user:
            admin_user.role = "admin"
            await session.commit()
            print(f"  + Admin set for: {admin_user.email}")
        else:
            print("  - Admin user not found yet (will be set on first signup)")

    print("Database initialization complete.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_db())
