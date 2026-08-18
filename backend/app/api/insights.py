from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.db.models import UrbanRecord
from app.ml.engine import generate_analytical_insights
from app.schemas.models import InsightItemSchema

router = APIRouter(tags=["AI Insight Engine"])

@router.get("/insights", response_model=List[InsightItemSchema])
@router.get("/v1/insights", response_model=List[InsightItemSchema])
def get_ai_insights(db: Session = Depends(get_db)):
    """
    AI INSIGHT ENGINE:
    Derives structured analytical insights directly from real database telemetry.
    Returns:
    - What changed
    - Where
    - Significance & magnitude
    - Contributing factors
    - Risk level
    - Recommended action
    - Evidence object & Statistical vs Assumption badge
    """
    # Fetch recent records from DB
    records_query = db.query(UrbanRecord).order_by(UrbanRecord.timestamp.desc()).limit(2000).all()
    records_data = [
        {
            "record_code": r.record_code,
            "location_name": r.location_name,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
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
            "is_anomaly": r.is_anomaly
        }
        for r in records_query
    ]

    insights = generate_analytical_insights(records_data)
    return [InsightItemSchema(**ins) for ins in insights]
