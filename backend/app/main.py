import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.db.models import UrbanRecord
from app.db.seeder import seed_database
from app.ml.engine import ml_engine
from app.api import overview, traffic, pollution, anomalies, predictions, insights, locations, explorer, analytics, auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("[Startup] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("[Startup] Running database seeder...")
        seed_database(db)

        # Train ML models on database dataset
        records = db.query(UrbanRecord).all()
        records_data = [
            {
                "traffic_density": r.traffic_density,
                "congestion_index": r.congestion_index,
                "avg_speed_kmh": r.avg_speed_kmh,
                "aqi": r.aqi,
                "pm25": r.pm25,
                "pm10": r.pm10,
                "co2_ppm": r.co2_ppm,
                "temperature_c": r.temperature_c,
                "humidity_pct": r.humidity_pct,
                "weather": r.weather,
                "risk_score": r.risk_score,
                "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            }
            for r in records
        ]
        ml_engine.train_models(records_data)
        print("[Startup] UrbanPulse AI Backend initialized successfully!")
    finally:
        db.close()

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "system": "UrbanPulse AI - Real-World Urban Data Analytics Platform",
        "version": settings.VERSION,
        "ml_engine_trained": ml_engine.is_trained,
        "database": "SQLite (urbanpulse.db)"
    }

# Register API Routers directly at both root `/api` and `/api/v1`
app.include_router(overview.router, prefix="/api")
app.include_router(traffic.router, prefix="/api")
app.include_router(pollution.router, prefix="/api")
app.include_router(anomalies.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(locations.router, prefix="/api")
app.include_router(explorer.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

# Duplicate mounts under `/api/v1` to ensure strict dual route support
app.include_router(overview.router, prefix="/api/v1")
app.include_router(traffic.router, prefix="/api/v1")
app.include_router(pollution.router, prefix="/api/v1")
app.include_router(anomalies.router, prefix="/api/v1")
app.include_router(predictions.router, prefix="/api/v1")
app.include_router(insights.router, prefix="/api/v1")
app.include_router(locations.router, prefix="/api/v1")
app.include_router(explorer.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")

# ==============================================================================
# ONE-SERVER FRONTEND STATIC FILE SERVING & SPA FALLBACK
# ==============================================================================
# Path to frontend build output directory (frontend/dist)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "..", ".."))
dist_dir = os.path.join(project_root, "frontend", "dist")
assets_dir = os.path.join(dist_dir, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    # Strictly preserve API routes from falling through to SPA index.html
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json") or full_path.startswith("redoc"):
        raise HTTPException(status_code=404, detail="API route not found")
    
    target_file = os.path.join(dist_dir, full_path)
    if os.path.exists(target_file) and os.path.isfile(target_file):
        return FileResponse(target_file)
    
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    raise HTTPException(status_code=404, detail="Frontend build not found. Please run 'npm run build' in the frontend directory.")
