"""
CyberGuardian AI - FastAPI Backend Server
Main entry point for the API server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.simulation import router as simulation_router
from .api.v1.auth import router as auth_router

app = FastAPI(
    title="CyberGuardian AI",
    description="AI-powered scam simulation and training platform",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
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

