from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class UrbanRecord(Base):
    __tablename__ = "urban_records"

    id = Column(Integer, primary_key=True, index=True)
    record_code = Column(String, unique=True, index=True)
    location_id = Column(String, index=True)
    location_name = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Traffic Metrics
    traffic_density = Column(Integer)  # Vehicles/min
    congestion_index = Column(Float)   # 0.0 to 1.0
    avg_speed_kmh = Column(Float)      # km/h

    # Air Quality & Weather Metrics
    aqi = Column(Integer, index=True)  # Air Quality Index
    pm25 = Column(Float)               # µg/m³
    pm10 = Column(Float)               # µg/m³
    co2_ppm = Column(Float)            # ppm
    temperature_c = Column(Float)      # °C
    humidity_pct = Column(Float)       # %
    weather = Column(String)           # Clear, Rain, Fog, Haze, etc.

    # Risk & Anomaly Status
    risk_score = Column(Float, index=True)  # 0 to 100
    is_anomaly = Column(Boolean, default=False, index=True)
    anomaly_type = Column(String, default="None")
    anomaly_explanation = Column(Text, default="")

    anomalies = relationship("AnomalyLog", back_populates="record", cascade="all, delete-orphan")

class LocationZone(Base):
    __tablename__ = "location_zones"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(String, unique=True, index=True)
    location_name = Column(String, index=True)
    area_type = Column(String)  # Commercial, Industrial, Residential, etc.
    latitude = Column(Float)
    longitude = Column(Float)
    base_traffic = Column(Integer)
    base_aqi = Column(Integer)

class AnomalyLog(Base):
    __tablename__ = "anomaly_logs"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("urban_records.id"), index=True)
    location_name = Column(String, index=True)
    anomaly_type = Column(String)  # Traffic Bottleneck, Air Quality Hazard, Severe Gridlock
    severity = Column(String)      # Low, Medium, High, Critical
    risk_score = Column(Float)     # 0 to 100
    explanation = Column(Text)
    detected_at = Column(DateTime, default=datetime.utcnow, index=True)

    record = relationship("UrbanRecord", back_populates="anomalies")

class InsightLog(Base):
    __tablename__ = "insight_logs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)      # Traffic, Pollution, Risk, Anomaly
    what_changed = Column(Text)
    where_location = Column(String)
    significance = Column(String)   # Moderate, High, Critical
    contributing_factors = Column(Text)  # JSON or comma-separated string
    risk_level = Column(String)     # Low, Medium, High, Critical
    recommended_action = Column(Text)
    evidence_type = Column(String)  # Statistical, Predictive, Assumption
    generated_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for OAuth users
    is_verified = Column(Boolean, default=False)
    auth_provider = Column(String, default="email")  # "email" or "google"
    verification_code = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

