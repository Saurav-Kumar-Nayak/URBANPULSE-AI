from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.db.models import UrbanRecord, LocationZone
from app.schemas.models import LocationZoneSchema

router = APIRouter(tags=["Locations & Spatial Telemetry"])

@router.get("/locations", response_model=List[LocationZoneSchema])
@router.get("/v1/locations", response_model=List[LocationZoneSchema])
def get_location_zones(db: Session = Depends(get_db)):
    zones = db.query(LocationZone).all()
    result = []

    for z in zones:
        latest = db.query(UrbanRecord).filter(UrbanRecord.location_id == z.location_id).order_by(UrbanRecord.timestamp.desc()).first()

        traffic = latest.traffic_density if latest else z.base_traffic
        congestion = round(float(latest.congestion_index), 2) if latest else 0.45
        aqi = latest.aqi if latest else z.base_aqi
        pm25 = round(float(latest.pm25), 1) if latest else 25.0
        risk = round(float(latest.risk_score), 1) if latest else 45.0
        is_anom = latest.is_anomaly if latest else False

        status = "Optimal" if risk < 40 else ("Elevated Risk" if risk < 65 else "Critical Hazard")

        result.append(LocationZoneSchema(
            location_id=z.location_id,
            location_name=z.location_name,
            area_type=z.area_type,
            latitude=z.latitude,
            longitude=z.longitude,
            traffic_density=traffic,
            congestion_index=congestion,
            aqi=aqi,
            pm25=pm25,
            risk_score=risk,
            is_anomaly=is_anom,
            status=status
        ))

    return result
