"""
CyberGuardian AI - FastAPI Backend Server
Main entry point for the API server.
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .api.v1.simulation import router as simulation_router
from .api.v1.auth import router as auth_router
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
    https_only=False  # Set to True in production with HTTPS
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

# CORS middleware - allowing local network for mobile testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://172.42.0.53:3000",  # Local network for mobile
        "http://172.42.0.53:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(simulation_router, prefix="/api/v1/simulation", tags=["Simulation"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])


@app.get("/")
async def root():
    return {"message": "CyberGuardian AI API Server", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
