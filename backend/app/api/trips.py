from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.db.models import UrbanRecord
from app.db.seeder import seed_database

router = APIRouter(prefix="/trips", tags=["Telemetry Records"])

@router.get("/")
def get_trips(
    is_anomaly: Optional[bool] = None,
    location_id: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(UrbanRecord)

    if is_anomaly is not None:
        query = query.filter(UrbanRecord.is_anomaly == is_anomaly)
    if location_id:
        query = query.filter(UrbanRecord.location_id == location_id)
    if search:
        query = query.filter(
            (UrbanRecord.record_code.ilike(f"%{search}%")) |
            (UrbanRecord.location_name.ilike(f"%{search}%")) |
            (UrbanRecord.weather.ilike(f"%{search}%"))
        )

    total = query.count()
    offset = (page - 1) * limit
    items = query.order_by(UrbanRecord.timestamp.desc()).offset(offset).limit(limit).all()

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": max(1, (total + limit - 1) // limit),
        "items": [
            {
                "id": t.id,
                "record_code": t.record_code,
                "location_id": t.location_id,
                "location_name": t.location_name,
                "latitude": t.latitude,
                "longitude": t.longitude,
                "traffic_density": t.traffic_density,
                "congestion_index": t.congestion_index,
                "avg_speed_kmh": t.avg_speed_kmh,
                "aqi": t.aqi,
                "pm25": t.pm25,
                "weather": t.weather,
                "timestamp": t.timestamp.isoformat() if t.timestamp else None,
                "is_anomaly": t.is_anomaly,
                "risk_score": t.risk_score
            }
            for t in items
        ]
    }

@router.get("/{record_id}")
def get_trip_detail(record_id: int, db: Session = Depends(get_db)):
    rec = db.query(UrbanRecord).filter(UrbanRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")
    
    return {
        "id": rec.id,
        "record_code": rec.record_code,
        "location_id": rec.location_id,
        "location_name": rec.location_name,
        "latitude": rec.latitude,
        "longitude": rec.longitude,
        "traffic_density": rec.traffic_density,
        "congestion_index": rec.congestion_index,
        "avg_speed_kmh": rec.avg_speed_kmh,
        "aqi": rec.aqi,
        "pm25": rec.pm25,
        "pm10": rec.pm10,
        "co2_ppm": rec.co2_ppm,
        "weather": rec.weather,
        "timestamp": rec.timestamp.isoformat() if rec.timestamp else None,
        "is_anomaly": rec.is_anomaly,
        "risk_score": rec.risk_score,
        "anomalies": [
            {
                "id": a.id,
                "anomaly_type": a.anomaly_type,
                "severity": a.severity,
                "risk_score": a.risk_score,
                "explanation": a.explanation,
                "detected_at": a.detected_at.isoformat() if a.detected_at else None
            }
            for a in rec.anomalies
        ]
    }
