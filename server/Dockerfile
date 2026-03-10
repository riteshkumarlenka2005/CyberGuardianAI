# CyberGuardian AI - Server Dockerfile (for Railway / production)
# Railway root directory: server/
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed by asyncpg and cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server source code (includes ai/ module)
COPY . .

# Run database init (creates tables + seeds badges) then start server
# Railway injects DATABASE_URL at runtime via env vars
CMD ["sh", "-c", "python init_db.py && uvicorn src.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
