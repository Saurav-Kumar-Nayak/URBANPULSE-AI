from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.core.database import get_db
from app.db.models import UrbanRecord
from app.schemas.models import PollutionResponseSchema, PollutionPointSchema, PollutionLocationSchema

router = APIRouter(tags=["Pollution Intelligence"])

@router.get("/pollution", response_model=PollutionResponseSchema)
@router.get("/v1/pollution", response_model=PollutionResponseSchema)
def get_pollution_intelligence(db: Session = Depends(get_db)):
    avg_aqi = db.query(func.avg(UrbanRecord.aqi)).scalar() or 0
    max_aqi = db.query(func.max(UrbanRecord.aqi)).scalar() or 0

    # 1. AQI & Particulate Trends (by hour of day)
    aqi_trends = []
    for h in range(24):
        h_str = f"{h:02d}:00"
        stats = db.query(
            func.avg(UrbanRecord.aqi),
            func.avg(UrbanRecord.pm25),
            func.avg(UrbanRecord.pm10)
        ).filter(extract('hour', UrbanRecord.timestamp) == h).first()

        aqi_trends.append(PollutionPointSchema(
            timestamp=h_str,
            aqi=int(stats[0] or 65),
            pm25=round(float(stats[1] or 25.0), 1),
            pm10=round(float(stats[2] or 50.0), 1)
        ))

    # 2. PM2.5 / PM10 vs CO2 Breakdown
    pm_breakdown = [
        {
            "pollutant": "PM2.5 (Fine Particulate)",
            "avg_value": round(float(db.query(func.avg(UrbanRecord.pm25)).scalar() or 28.5), 1),
            "unit": "µg/m³",
            "threshold_safe": 35.0,
            "status": "Moderate"
        },
        {
            "pollutant": "PM10 (Coarse Particulate)",
            "avg_value": round(float(db.query(func.avg(UrbanRecord.pm10)).scalar() or 58.2), 1),
            "unit": "µg/m³",
            "threshold_safe": 50.0,
            "status": "Moderate"
        },
        {
            "pollutant": "CO2 Concentration",
            "avg_value": round(float(db.query(func.avg(UrbanRecord.co2_ppm)).scalar() or 445.0), 1),
            "unit": "ppm",
            "threshold_safe": 450.0,
            "status": "Normal"
        }
    ]

    # 3. Weather vs Pollution Correlation
    weathers = ["Clear", "Partly Cloudy", "Rain", "Heavy Rain", "Fog", "Haze"]
    weather_correlation = []
    for w in weathers:
        w_stats = db.query(
            func.avg(UrbanRecord.aqi),
            func.avg(UrbanRecord.pm25),
            func.avg(UrbanRecord.temperature_c),
            func.avg(UrbanRecord.humidity_pct)
        ).filter(UrbanRecord.weather == w).first()
        if w_stats[0] is not None:
            weather_correlation.append({
                "weather": w,
                "avg_aqi": int(w_stats[0]),
                "avg_pm25": round(float(w_stats[1]), 1),
                "avg_temperature": round(float(w_stats[2]), 1),
                "avg_humidity": round(float(w_stats[3]), 1)
            })

    # 4. Location Rankings
    loc_stats = db.query(
        UrbanRecord.location_id,
        UrbanRecord.location_name,
        func.avg(UrbanRecord.aqi),
        func.avg(UrbanRecord.pm25),
        func.avg(UrbanRecord.pm10)
    ).group_by(UrbanRecord.location_id, UrbanRecord.location_name).all()

    location_rankings = []
    for l in loc_stats:
        l_aqi = int(l[2] or 0)
        status = "Good" if l_aqi < 50 else ("Moderate" if l_aqi < 100 else ("Unhealthy for Sensitive Groups" if l_aqi < 150 else "Unhealthy"))
        location_rankings.append(PollutionLocationSchema(
            location_id=l[0],
            location_name=l[1],
            avg_aqi=l_aqi,
            avg_pm25=round(float(l[3] or 0.0), 1),
            avg_pm10=round(float(l[4] or 0.0), 1),
            status=status
        ))
    location_rankings.sort(key=lambda x: x.avg_aqi, reverse=True)

    return PollutionResponseSchema(
        avg_aqi=int(avg_aqi),
        max_aqi=int(max_aqi),
        aqi_trends=aqi_trends,
        pm_breakdown=pm_breakdown,
        weather_correlation=weather_correlation,
        location_rankings=location_rankings
    )
