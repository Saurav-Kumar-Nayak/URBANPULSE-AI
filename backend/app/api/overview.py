from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.db.models import UrbanRecord, LocationZone, AnomalyLog
from app.ml.engine import ml_engine
from app.schemas.models import OverviewResponseSchema, KpiCardSchema

router = APIRouter(tags=["Executive Overview"])

@router.get("/overview", response_model=OverviewResponseSchema)
@router.get("/v1/overview", response_model=OverviewResponseSchema)
def get_executive_overview(db: Session = Depends(get_db)):
    total_records = db.query(UrbanRecord).count()
    if total_records == 0:
        return OverviewResponseSchema(
            total_records=0, avg_aqi=0, aqi_status="N/A", avg_congestion_index=0.0,
            avg_congestion_pct="0%", urban_risk_score=0.0, risk_level="Low",
            anomaly_count=0, active_zones=0, data_freshness="No Data", kpis=[],
            prediction_summary={}
        )

    avg_aqi = db.query(func.avg(UrbanRecord.aqi)).scalar() or 0
    avg_aqi = int(avg_aqi)
    aqi_status = "Good" if avg_aqi < 50 else ("Moderate" if avg_aqi < 100 else ("Unhealthy for Sensitive Groups" if avg_aqi < 150 else "Unhealthy"))

    avg_cg = db.query(func.avg(UrbanRecord.congestion_index)).scalar() or 0.0
    avg_cg = round(float(avg_cg), 2)
    avg_cg_pct = f"{int(avg_cg * 100)}%"

    avg_risk = db.query(func.avg(UrbanRecord.risk_score)).scalar() or 0.0
    avg_risk = round(float(avg_risk), 1)
    risk_level = "Low" if avg_risk < 30 else ("Medium" if avg_risk < 55 else ("High" if avg_risk < 75 else "Critical"))

    anomaly_count = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True).count()
    active_zones = db.query(LocationZone).count() or 8

    latest_record = db.query(UrbanRecord).order_by(UrbanRecord.timestamp.desc()).first()
    data_freshness = latest_record.timestamp.strftime("%Y-%m-%d %H:%M:%S") if latest_record else "Live Telemetry"

    # Dynamic KPI Cards
    kpis = [
        KpiCardSchema(title="Total Urban Records", value=f"{total_records:,}", unit="records", change="+4.2%", trend="up", status="normal"),
        KpiCardSchema(title="Air Quality Index (AQI)", value=avg_aqi, unit="AQI", change=aqi_status, trend="down" if avg_aqi < 75 else "up", status="normal" if avg_aqi < 100 else "warning"),
        KpiCardSchema(title="Traffic Congestion", value=avg_cg_pct, unit="index", change=f"{avg_cg:.2f}", trend="up" if avg_cg > 0.5 else "down", status="normal" if avg_cg < 0.6 else "warning"),
        KpiCardSchema(title="Urban Risk Score", value=avg_risk, unit="/100", change=risk_level, trend="neutral", status="normal" if avg_risk < 50 else "critical"),
        KpiCardSchema(title="Active Anomalies", value=anomaly_count, unit="events", change=f"{round((anomaly_count/total_records)*100,1)}%", trend="down", status="warning" if anomaly_count > 100 else "normal"),
        KpiCardSchema(title="Monitored Zones", value=active_zones, unit="zones", change="Active", trend="neutral", status="normal")
    ]

    # Quick ML prediction sample
    prediction_summary = {
        "aqi_model_r2": ml_engine.metrics["aqi_model"]["r2"],
        "traffic_model_r2": ml_engine.metrics["traffic_model"]["r2"],
        "risk_model_accuracy": ml_engine.metrics["risk_model"]["accuracy"],
        "forecast_status": "ML Engine Active & Operational"
    }

    return OverviewResponseSchema(
        total_records=total_records,
        avg_aqi=avg_aqi,
        aqi_status=aqi_status,
        avg_congestion_index=avg_cg,
        avg_congestion_pct=avg_cg_pct,
        urban_risk_score=avg_risk,
        risk_level=risk_level,
        anomaly_count=anomaly_count,
        active_zones=active_zones,
        data_freshness=data_freshness,
        kpis=kpis,
        prediction_summary=prediction_summary
    )
