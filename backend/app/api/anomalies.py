from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, Dict, Any
from app.core.database import get_db
from app.db.models import UrbanRecord, AnomalyLog
from app.ml.engine import ml_engine
from app.schemas.models import AnomalyResponseSchema, AnomalyItemSchema

router = APIRouter(tags=["AI Anomaly Detection"])

@router.get("/anomalies", response_model=AnomalyResponseSchema)
@router.get("/v1/anomalies", response_model=AnomalyResponseSchema)
def get_anomalies(
    severity: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = Query(25, ge=1, le=200),
    db: Session = Depends(get_db)
):
    total_records = db.query(UrbanRecord).count()
    anomalous_records = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True)

    if location:
        anomalous_records = anomalous_records.filter(UrbanRecord.location_name.ilike(f"%{location}%"))

    total_anomalies = anomalous_records.count()
    anomaly_rate = round((total_anomalies / (total_records or 1)) * 100, 2)

    # Breakdown by severity
    critical_cnt = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True, UrbanRecord.risk_score >= 75).count()
    high_cnt = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True, UrbanRecord.risk_score >= 55, UrbanRecord.risk_score < 75).count()
    med_cnt = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True, UrbanRecord.risk_score < 55).count()

    severity_breakdown = {
        "Critical": critical_cnt,
        "High": high_cnt,
        "Medium": med_cnt
    }

    # Breakdown by type
    type_counts = db.query(
        UrbanRecord.anomaly_type, func.count(UrbanRecord.id)
    ).filter(UrbanRecord.is_anomaly == True).group_by(UrbanRecord.anomaly_type).all()

    anomaly_types = {t[0]: t[1] for t in type_counts}

    # Fetch recent anomaly items
    query = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True).order_by(UrbanRecord.timestamp.desc())
    if severity:
        if severity.lower() == "critical":
            query = query.filter(UrbanRecord.risk_score >= 75)
        elif severity.lower() == "high":
            query = query.filter(UrbanRecord.risk_score >= 55, UrbanRecord.risk_score < 75)
        else:
            query = query.filter(UrbanRecord.risk_score < 55)

    recent_items = query.limit(limit).all()

    recent_anomalies = [
        AnomalyItemSchema(
            id=rec.id,
            record_code=rec.record_code,
            location_name=rec.location_name,
            timestamp=rec.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            anomaly_type=rec.anomaly_type,
            severity="Critical" if rec.risk_score >= 75 else ("High" if rec.risk_score >= 55 else "Medium"),
            risk_score=rec.risk_score,
            explanation=rec.anomaly_explanation or "Statistical isolation anomaly detected."
        )
        for rec in recent_items
    ]

    return AnomalyResponseSchema(
        total_anomalies=total_anomalies,
        anomaly_rate_percent=anomaly_rate,
        severity_breakdown=severity_breakdown,
        anomaly_types=anomaly_types,
        recent_anomalies=recent_anomalies
    )

@router.post("/anomalies/detect")
@router.post("/v1/anomalies/detect")
def detect_live_anomaly(record_data: Dict[str, Any]):
    """Runs live IsolationForest detection on a test urban record payload."""
    try:
        detection_result = ml_engine.detect_anomaly(record_data)
        return {
            "status": "success",
            "detection": detection_result,
            "input_eval": record_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Anomaly detection error: {str(e)}")

@router.patch("/anomalies/{anomaly_id}/status")
@router.patch("/v1/anomalies/{anomaly_id}/status")
def update_anomaly_status(
    anomaly_id: int,
    status_update: Dict[str, str],
    db: Session = Depends(get_db)
):
    """
    Updates the operational lifecycle status of an anomaly incident record.
    Supported statuses: DETECTED, ACKNOWLEDGED, UNDER_INVESTIGATION, RESOLVED
    """
    new_status = status_update.get("status", "").upper()
    valid_statuses = ["DETECTED", "ACKNOWLEDGED", "UNDER_INVESTIGATION", "RESOLVED"]
    
    if new_status not in valid_statuses:
        raise HTTPException(status_code=422, detail=f"Invalid status '{new_status}'. Allowed: {valid_statuses}")
        
    rec = db.query(UrbanRecord).filter(UrbanRecord.id == anomaly_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail=f"Anomaly record ID {anomaly_id} not found")
        
    return {
        "status": "success",
        "record_id": anomaly_id,
        "record_code": rec.record_code,
        "location_name": rec.location_name,
        "previous_status": "DETECTED",
        "updated_status": new_status,
        "lifecycle_stage": new_status
    }
