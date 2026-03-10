import asyncio, sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent))
from src.app.database import engine
from sqlalchemy import text

async def migrate():
    async with engine.begin() as conn:
        # Force add role column - use try/except since info_schema might be stale
        try:
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"
            ))
            print("Added 'role' column.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                print("'role' column already exists.")
            else:
                print(f"Note: {e}")

    # Use a fresh connection for the update
    async with engine.begin() as conn:
        await conn.execute(text(
            "UPDATE users SET role='admin' WHERE email='lenkariteshkumar2005@gmail.com'"
        ))
        print("Admin role set.")

        r = await conn.execute(text("SELECT id, email, role FROM users LIMIT 10"))
        rows = r.all()
        print("\n=== Users ===")
        for row in rows:
            print(f"  id={row[0]} email={row[1]} role={row[2]}")

    await engine.dispose()

asyncio.run(migrate())
