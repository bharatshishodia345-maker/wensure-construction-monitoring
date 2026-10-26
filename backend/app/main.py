import logging
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text

from backend.app.config import settings
from backend.app.database import engine, Base, AsyncSessionLocal
from backend.app.services.seed_service import seed_database_if_empty

from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.projects import router as projects_router
from backend.app.api.routes.milestones import router as milestones_router
from backend.app.api.routes.inspections import router as inspections_router
from backend.app.api.routes.financials import router as financials_router
from backend.app.api.routes.contractors import router as contractors_router
from backend.app.api.routes.disputes import router as disputes_router
from backend.app.api.routes.notifications import router as notifications_router
from backend.app.api.routes.analytics import router as analytics_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("wensure.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema & baseline seed
    logger.info("Initializing WENSURE database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed baseline if empty
    async with AsyncSessionLocal() as session:
        await seed_database_if_empty(session)
    logger.info("WENSURE database ready with seed data.")

    yield

    logger.info("Shutting down WENSURE API...")
    await engine.dispose()

app = FastAPI(
    title=settings.APP_NAME,
    description="WENSURE Independent Construction Monitoring & Milestone Verification API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration - use configured origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "body": str(exc.body) if hasattr(exc, "body") else None
        }
    )

# Health Check Endpoints
@app.get("/health", tags=["Health"])
async def root_health_check(response: Response):
    """System health verification and database connectivity check."""
    db_status = "connected"
    is_ready = True
    engine_name = "sqlite" if "sqlite" in settings.DATABASE_URL else "postgresql"
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        is_ready = False
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    now_iso = datetime.now(timezone.utc).isoformat()
    return {
        "status": "healthy" if is_ready else "unhealthy",
        "ready": is_ready,
        "service": "wensure-backend",
        "database": db_status,
        "database_engine": engine_name,
        "version": "1.0.0",
        "timestamp": now_iso
    }

@app.get("/api/v1/health", tags=["Health"])
async def api_health_check(response: Response):
    return await root_health_check(response)

# Mount API Routers
API_V1_PREFIX = "/api/v1"
app.include_router(auth_router, prefix=API_V1_PREFIX)
app.include_router(projects_router, prefix=API_V1_PREFIX)
app.include_router(milestones_router, prefix=API_V1_PREFIX)
app.include_router(inspections_router, prefix=API_V1_PREFIX)
app.include_router(financials_router, prefix=API_V1_PREFIX)
app.include_router(contractors_router, prefix=API_V1_PREFIX)
app.include_router(disputes_router, prefix=API_V1_PREFIX)
app.include_router(notifications_router, prefix=API_V1_PREFIX)
app.include_router(analytics_router, prefix=API_V1_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
