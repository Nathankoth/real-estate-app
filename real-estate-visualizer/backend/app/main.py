"""
Real Estate Visualizer Backend
FastAPI application for AI rendering, ROI calculations, and market analysis
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

# Import API routers
from app.api import render, roi, market, auth
from app.services.ai_engine import ai_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("Initializing AI models...")
    await ai_engine.initialize_models()
    print("AI models initialized successfully!")
    
    yield
    
    # Shutdown
    print("Shutting down application...")

# Create FastAPI application
app = FastAPI(
    title="Real Estate Visualizer API",
    description="AI-powered real estate visualization, ROI analysis, and market insights",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.vercel.app",
        "https://*.lovable.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(render.router)
app.include_router(roi.router)
app.include_router(market.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Real Estate Visualizer API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "rendering": "/api/render",
            "roi_analysis": "/api/roi",
            "market_analysis": "/api/market",
            "authentication": "/api/auth",
            "documentation": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ai_models_loaded": ai_engine.model_loaded,
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "path": str(request.url)
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
