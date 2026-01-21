"""
Database migration script to add email verification columns.
Run this script to update the database schema.
"""

import asyncio
import asyncpg

async def run_migration():
    # Connection string from .env
    conn = await asyncpg.connect(
        user='postgres',
        password='PostgreSQL@2005',
        database='cyberguardian',
        host='127.0.0.1',
        port=5432
    )
    
    print("Connected to database. Running migration...")
    
    try:
        # Add new columns if they don't exist
        await conn.execute('''
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(100);
        ''')
        print("✓ Added email_verification_token column")
        
        await conn.execute('''
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMP;
        ''')
        print("✓ Added email_verification_expires_at column")
        
        # Drop old column if it exists
        # First check if it exists
        result = await conn.fetchval('''
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'verification_token'
            );
        ''')
        
        if result:
            await conn.execute('ALTER TABLE users DROP COLUMN verification_token;')
            print("✓ Dropped old verification_token column")
        else:
            print("- Old verification_token column doesn't exist (OK)")
        
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run_migration())
