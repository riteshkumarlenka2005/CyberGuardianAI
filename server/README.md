# CyberGuardian AI - Server

Backend API server for CyberGuardian AI platform.

## Stack (Planned)
- Python 3.11+
- FastAPI
- PostgreSQL
- Redis

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn src.app.main:app --reload
```

## Structure

```
server/
├── src/
│   └── app/
│       ├── main.py          # App entry point
│       ├── config.py        # Environment config
│       ├── api/v1/          # API routes
│       ├── services/        # Business logic
│       ├── models/          # Database models
│       ├── schemas/         # Pydantic schemas
│       ├── middleware/      # Custom middleware
│       └── security/        # Auth & security
├── tests/                   # Test suites
├── requirements.txt
└── Dockerfile
```
