
import asyncio
import sys
from pathlib import Path

# Add the server directory to sys.path so we can import from src
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from src.app.database import engine, Base
from src.app.models.user import User  # Import all models to ensure they are registered

async def init_db():
    print("Connecting to PostgreSQL...")
    async with engine.begin() as conn:
        print("Creating tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialization complete.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_db())
