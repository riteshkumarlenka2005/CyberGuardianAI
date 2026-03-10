"""
CyberGuardian AI - FastAPI Backend Server
Main entry point for the API server.
"""

import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .api.v1.simulation import router as simulation_router
from .api.v1.auth import router as auth_router
from .api.v1.progress import router as progress_router
from .api.v1.gallery import router as gallery_router
from .api.v1.resources import router as resources_router
from .api.v1.admin import router as admin_router
from .api.v1.upload import router as upload_router
from .security.config import settings

app = FastAPI(
    title="CyberGuardian AI",
    description="AI-powered scam simulation and training platform",
    version="1.0.0"
)

# Session middleware for OAuth state management
# Secret is loaded from environment variable SESSION_SECRET
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSION_SECRET,
    session_cookie="cyberguardian_session",
    max_age=3600,  # 1 hour
    same_site="lax",
    https_only="localhost" not in settings.BACKEND_URL,
)

# Logging middleware for debugging
@app.middleware("http")
async def log_requests(request, call_next):
    origin = request.headers.get("origin")
    print(f"Request: {request.method} {request.url} | Origin: {origin}")
    try:
        response = await call_next(request)
        print(f"Response: {response.status_code}")
        return response
    except Exception as e:
        print(f"ERROR in middleware: {str(e)}")
        return JSONResponse(status_code=500, content={"detail": str(e)}) # Ensure CORS headers are still added in error case

# CORS middleware - origins from env for production, with localhost fallbacks for dev
_cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
if settings.CORS_ORIGINS:
    _cors_origins.extend([o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()])
if settings.FRONTEND_URL and settings.FRONTEND_URL not in _cors_origins:
    _cors_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(simulation_router, prefix="/api/v1/simulation", tags=["Simulation"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(progress_router, prefix="/api/v1/progress", tags=["Progress"])
app.include_router(gallery_router, prefix="/api/v1", tags=["Gallery"])
app.include_router(resources_router, prefix="/api/v1", tags=["Resources"])
app.include_router(admin_router, prefix="/api/v1", tags=["Admin"])
app.include_router(upload_router, prefix="/api/v1", tags=["Upload"])

# Serve uploaded files as static
_upload_dir = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(_upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_upload_dir), name="uploads")


@app.get("/")
async def root():
    return {"message": "CyberGuardian AI API Server", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
