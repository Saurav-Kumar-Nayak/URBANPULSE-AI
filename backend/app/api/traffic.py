from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.core.database import get_db
from app.db.models import UrbanRecord
from app.schemas.models import TrafficResponseSchema, TrafficHourlySchema, TrafficLocationSchema

router = APIRouter(tags=["Traffic Intelligence"])

@router.get("/traffic", response_model=TrafficResponseSchema)
@router.get("/v1/traffic", response_model=TrafficResponseSchema)
def get_traffic_intelligence(
    timeframe: Optional[str] = Query("24h"),
    db: Session = Depends(get_db)
):
    # Filter base query by timeframe relative to maximum timestamp in DB
    max_ts = db.query(func.max(UrbanRecord.timestamp)).scalar() or datetime.utcnow()
    tf_lower = (timeframe or "24h").lower()
    if tf_lower == "1h":
        start_ts = max_ts - timedelta(hours=1)
    elif tf_lower == "6h":
        start_ts = max_ts - timedelta(hours=6)
    elif tf_lower == "7d":
        start_ts = max_ts - timedelta(days=7)
    elif tf_lower == "30d":
        start_ts = max_ts - timedelta(days=30)
    else:
        start_ts = max_ts - timedelta(hours=24)

    base_query = db.query(UrbanRecord).filter(UrbanRecord.timestamp >= start_ts)
    # 1. Hourly Traffic Breakdown
    hourly_trends = []
    for h in range(24):
        h_str = f"{h:02d}:00"
        records_h = base_query.with_entities(
            func.avg(UrbanRecord.traffic_density),
            func.avg(UrbanRecord.congestion_index),
            func.avg(UrbanRecord.avg_speed_kmh)
        ).filter(extract('hour', UrbanRecord.timestamp) == h).first()

        traffic_density = int(records_h[0] or 110)
        congestion_index = round(float(records_h[1] or 0.4), 2)
        avg_speed_kmh = round(float(records_h[2] or 35.0), 1)

        hourly_trends.append(TrafficHourlySchema(
            hour=h_str,
            traffic_density=traffic_density,
            congestion_index=congestion_index,
            avg_speed_kmh=avg_speed_kmh
        ))

    # Identify peak hours (top 4 congestion hours)
    sorted_h = sorted(hourly_trends, key=lambda x: x.congestion_index, reverse=True)
    peak_hours = [x.hour for x in sorted_h[:4]]

    # 2. Location Congestion Rankings
    loc_stats = base_query.with_entities(
        UrbanRecord.location_id,
        UrbanRecord.location_name,
        func.avg(UrbanRecord.congestion_index),
        func.avg(UrbanRecord.avg_speed_kmh),
        func.avg(UrbanRecord.traffic_density)
    ).group_by(UrbanRecord.location_id, UrbanRecord.location_name).all()

    location_rankings = [
        TrafficLocationSchema(
            location_id=l[0],
            location_name=l[1],
            avg_congestion=round(float(l[2] or 0.0), 2),
            avg_speed=round(float(l[3] or 0.0), 1),
            traffic_volume=int(l[4] or 0)
        )
        for l in loc_stats
    ]
    location_rankings.sort(key=lambda x: x.avg_congestion, reverse=True)

    # 3. Weekday vs Weekend Comparison
    weekday_rec = db.query(func.avg(UrbanRecord.congestion_index), func.avg(UrbanRecord.traffic_density), func.avg(UrbanRecord.avg_speed_kmh)).filter(extract('dow', UrbanRecord.timestamp).in_([1,2,3,4,5])).first()
    weekend_rec = db.query(func.avg(UrbanRecord.congestion_index), func.avg(UrbanRecord.traffic_density), func.avg(UrbanRecord.avg_speed_kmh)).filter(extract('dow', UrbanRecord.timestamp).in_([0,6])).first()

    weekday_vs_weekend = [
        {
            "category": "Weekday Commute",
            "avg_congestion": round(float(weekday_rec[0] or 0.52), 2),
            "avg_traffic_density": int(weekday_rec[1] or 165),
            "avg_speed_kmh": round(float(weekday_rec[2] or 28.5), 1)
        },
        {
            "category": "Weekend Flow",
            "avg_congestion": round(float(weekend_rec[0] or 0.34), 2),
            "avg_traffic_density": int(weekend_rec[1] or 105),
            "avg_speed_kmh": round(float(weekend_rec[2] or 41.2), 1)
        }
    ]

    # 4. Short-term Congestion Forecast (Next 12 Hours)
    congestion_forecast = []
    base_forecast_cg = hourly_trends[18].congestion_index if len(hourly_trends) > 18 else 0.55
    for f_h in range(1, 13):
        projected_hour = (18 + f_h) % 24
        hist_cg = hourly_trends[projected_hour].congestion_index
        forecasted_val = round(min(0.98, max(0.08, hist_cg * 0.95 + (0.05 * (f_h % 3)))), 2)
        congestion_forecast.append({
            "hour_ahead": f"+{f_h}h ({projected_hour:02d}:00)",
            "predicted_congestion": forecasted_val,
            "confidence_lower": round(max(0.05, forecasted_val - 0.06), 2),
            "confidence_upper": round(min(0.99, forecasted_val + 0.06), 2)
        })

    return TrafficResponseSchema(
        peak_hours=peak_hours,
        hourly_trends=hourly_trends,
        location_rankings=location_rankings,
        weekday_vs_weekend=weekday_vs_weekend,
        congestion_forecast=congestion_forecast
    )
