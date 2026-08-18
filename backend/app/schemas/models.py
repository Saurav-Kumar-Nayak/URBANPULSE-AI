from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class KpiCardSchema(BaseModel):
    title: str
    value: Any
    unit: Optional[str] = ""
    change: Optional[str] = ""
    trend: Optional[str] = "up"  # up, down, neutral
    status: Optional[str] = "normal"  # normal, warning, critical

class KpiSummarySchema(BaseModel):
    total_trips: int
    total_anomalies: int
    anomaly_rate_percent: float
    avg_congestion_index: float
    avg_speed_kmh: float
    total_revenue_usd: float
    active_vehicles_count: int
    co2_saved_tons: float

class OverviewResponseSchema(BaseModel):
    total_records: int
    avg_aqi: int
    aqi_status: str
    avg_congestion_index: float
    avg_congestion_pct: str
    urban_risk_score: float
    risk_level: str
    anomaly_count: int
    active_zones: int
    data_freshness: str
    kpis: List[KpiCardSchema]
    prediction_summary: Dict[str, Any]

class TrafficHourlySchema(BaseModel):
    hour: str
    traffic_density: int
    congestion_index: float
    avg_speed_kmh: float

class TrafficLocationSchema(BaseModel):
    location_id: str
    location_name: str
    avg_congestion: float
    avg_speed: float
    traffic_volume: int

class TrafficResponseSchema(BaseModel):
    peak_hours: List[str]
    hourly_trends: List[TrafficHourlySchema]
    location_rankings: List[TrafficLocationSchema]
    weekday_vs_weekend: List[Dict[str, Any]]
    congestion_forecast: List[Dict[str, Any]]

class PollutionPointSchema(BaseModel):
    timestamp: str
    aqi: int
    pm25: float
    pm10: float

class PollutionLocationSchema(BaseModel):
    location_id: str
    location_name: str
    avg_aqi: int
    avg_pm25: float
    avg_pm10: float
    status: str

class PollutionResponseSchema(BaseModel):
    avg_aqi: int
    max_aqi: int
    aqi_trends: List[PollutionPointSchema]
    pm_breakdown: List[Dict[str, Any]]
    weather_correlation: List[Dict[str, Any]]
    location_rankings: List[PollutionLocationSchema]

class AnomalyItemSchema(BaseModel):
    id: int
    record_code: str
    location_name: str
    timestamp: str
    anomaly_type: str
    severity: str
    risk_score: float
    explanation: str

class AnomalyResponseSchema(BaseModel):
    total_anomalies: int
    anomaly_rate_percent: float
    severity_breakdown: Dict[str, int]
    anomaly_types: Dict[str, int]
    recent_anomalies: List[AnomalyItemSchema]

class PredictionInputSchema(BaseModel):
    target: str = Field(..., description="Target model: 'aqi', 'traffic', or 'risk'")
    traffic_density: Optional[int] = 140
    avg_speed_kmh: Optional[float] = 30.0
    temperature_c: Optional[float] = 24.0
    humidity_pct: Optional[float] = 60.0
    pm25: Optional[float] = 28.0
    pm10: Optional[float] = 52.0
    co2_ppm: Optional[float] = 440.0
    aqi: Optional[int] = 75
    congestion_index: Optional[float] = 0.5
    risk_score: Optional[float] = 45.0
    hour: Optional[int] = 17
    day_of_week: Optional[int] = 2
    is_weekend: Optional[int] = 0

class PredictionResponseSchema(BaseModel):
    target: str
    model_name: str
    prediction_result: Any
    metrics: Dict[str, Any]
    feature_importances: List[Dict[str, Any]]

class InsightItemSchema(BaseModel):
    id: str
    title: str
    category: str
    what_changed: str
    where: str
    significance: str
    contributing_factors: List[str]
    risk_level: str
    recommended_action: str
    evidence: Dict[str, Any]
    evidence_type: str

class LocationZoneSchema(BaseModel):
    location_id: str
    location_name: str
    area_type: str
    latitude: float
    longitude: float
    traffic_density: int
    congestion_index: float
    aqi: int
    pm25: float
    risk_score: float
    is_anomaly: bool
    status: str

class UrbanRecordSchema(BaseModel):
    id: int
    record_code: str
    location_id: str
    location_name: str
    latitude: float
    longitude: float
    timestamp: str
    traffic_density: int
    congestion_index: float
    avg_speed_kmh: float
    aqi: int
    pm25: float
    pm10: float
    co2_ppm: float
    temperature_c: float
    humidity_pct: float
    weather: str
    risk_score: float
    is_anomaly: bool
    anomaly_type: str
    anomaly_explanation: str

class PaginatedRecordsSchema(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    records: List[UrbanRecordSchema]
