import csv
import io
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.core.database import get_db
from app.db.models import UrbanRecord
from app.schemas.models import PaginatedRecordsSchema, UrbanRecordSchema

router = APIRouter(tags=["Data Explorer"])

@router.get("/records", response_model=PaginatedRecordsSchema)
@router.get("/v1/records", response_model=PaginatedRecordsSchema)
def search_and_filter_records(
    search: Optional[str] = None,
    location: Optional[str] = None,
    risk_level: Optional[str] = None,
    is_anomaly: Optional[bool] = None,
    weather: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(UrbanRecord)

    if search:
        query = query.filter(
            (UrbanRecord.record_code.ilike(f"%{search}%")) |
            (UrbanRecord.location_name.ilike(f"%{search}%")) |
            (UrbanRecord.weather.ilike(f"%{search}%")) |
            (UrbanRecord.anomaly_type.ilike(f"%{search}%"))
        )

    if location and location != "ALL":
        query = query.filter(UrbanRecord.location_name.ilike(f"%{location}%"))

    if weather and weather != "ALL":
        query = query.filter(UrbanRecord.weather == weather)

    if is_anomaly is not None:
        query = query.filter(UrbanRecord.is_anomaly == is_anomaly)

    if risk_level and risk_level != "ALL":
        if risk_level.lower() == "critical":
            query = query.filter(UrbanRecord.risk_score >= 75)
        elif risk_level.lower() == "high":
            query = query.filter(UrbanRecord.risk_score >= 55, UrbanRecord.risk_score < 75)
        elif risk_level.lower() == "medium":
            query = query.filter(UrbanRecord.risk_score >= 30, UrbanRecord.risk_score < 55)
        elif risk_level.lower() == "low":
            query = query.filter(UrbanRecord.risk_score < 30)

    total_count = query.count()
    total_pages = max(1, (total_count + page_size - 1) // page_size)

    records = query.order_by(UrbanRecord.timestamp.desc()).offset((page - 1) * page_size).limit(page_size).all()

    record_items = [
        UrbanRecordSchema(
            id=r.id,
            record_code=r.record_code,
            location_id=r.location_id,
            location_name=r.location_name,
            latitude=r.latitude,
            longitude=r.longitude,
            timestamp=r.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            traffic_density=r.traffic_density,
            congestion_index=r.congestion_index,
            avg_speed_kmh=r.avg_speed_kmh,
            aqi=r.aqi,
            pm25=r.pm25,
            pm10=r.pm10,
            co2_ppm=r.co2_ppm,
            temperature_c=r.temperature_c,
            humidity_pct=r.humidity_pct,
            weather=r.weather,
            risk_score=r.risk_score,
            is_anomaly=r.is_anomaly,
            anomaly_type=r.anomaly_type,
            anomaly_explanation=r.anomaly_explanation or ""
        )
        for r in records
    ]

    return PaginatedRecordsSchema(
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        records=record_items
    )

@router.get("/records/export")
@router.get("/v1/records/export")
def export_records_csv(
    location: Optional[str] = None,
    is_anomaly: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Exports filtered dataset records directly as downloadable CSV file."""
    query = db.query(UrbanRecord)
    if location and location != "ALL":
        query = query.filter(UrbanRecord.location_name.ilike(f"%{location}%"))
    if is_anomaly is not None:
        query = query.filter(UrbanRecord.is_anomaly == is_anomaly)

    records = query.order_by(UrbanRecord.timestamp.desc()).limit(5000).all()

    output = io.StringIO()
    fieldnames = [
        "record_code", "location_id", "location_name", "latitude", "longitude",
        "timestamp", "traffic_density", "congestion_index", "avg_speed_kmh",
        "aqi", "pm25", "pm10", "co2_ppm", "temperature_c", "humidity_pct",
        "weather", "risk_score", "is_anomaly", "anomaly_type", "anomaly_explanation"
    ]

    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()

    for r in records:
        writer.writerow({
            "record_code": r.record_code,
            "location_id": r.location_id,
            "location_name": r.location_name,
            "latitude": r.latitude,
            "longitude": r.longitude,
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
            "is_anomaly": r.is_anomaly,
            "anomaly_type": r.anomaly_type,
            "anomaly_explanation": r.anomaly_explanation
        })

    output.seek(0)
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=urbanpulse_export.csv"
    return response
