# CyberGuardian AI - Database

Database schemas, migrations, and seed data.

## Schema Files

- `user.sql` - User accounts and profiles
- `scenario.sql` - Training scenarios
- `chat_log.sql` - Conversation history
- `progress.sql` - User learning progress
- `rewards.sql` - Badges and achievements

## Migrations

Using Alembic for database migrations. Run from server directory:

```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Seeding

```bash
python -m database.seeds.run
```
