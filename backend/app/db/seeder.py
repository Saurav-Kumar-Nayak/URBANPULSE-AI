import os
import csv
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import UrbanRecord, LocationZone, AnomalyLog, InsightLog

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "data")
CSV_PATH = os.path.join(DATA_DIR, "urbanpulse_dataset.csv")

LOCATIONS_META = [
    {"location_id": "LOC-01", "location_name": "Patia Main Road", "area_type": "Commercial", "latitude": 20.3533, "longitude": 85.8197, "base_traffic": 180, "base_aqi": 75},
    {"location_id": "LOC-02", "location_name": "Jayadev Vihar", "area_type": "Financial", "latitude": 20.3010, "longitude": 85.8239, "base_traffic": 210, "base_aqi": 85},
    {"location_id": "LOC-03", "location_name": "Saheed Nagar", "area_type": "Industrial", "latitude": 20.2872, "longitude": 85.8415, "base_traffic": 150, "base_aqi": 115},
    {"location_id": "LOC-04", "location_name": "Khandagiri", "area_type": "Technology", "latitude": 20.2588, "longitude": 85.7836, "base_traffic": 130, "base_aqi": 55},
    {"location_id": "LOC-05", "location_name": "Vani Vihar", "area_type": "Educational", "latitude": 20.2974, "longitude": 85.8364, "base_traffic": 85, "base_aqi": 42},
    {"location_id": "LOC-06", "location_name": "Bhubaneswar Railway Station", "area_type": "Transit", "latitude": 20.2657, "longitude": 85.8436, "base_traffic": 190, "base_aqi": 95},
    {"location_id": "LOC-07", "location_name": "Nandankanan Road", "area_type": "Commercial", "latitude": 20.3700, "longitude": 85.8250, "base_traffic": 160, "base_aqi": 60},
    {"location_id": "LOC-08", "location_name": "Kalarahanga Road", "area_type": "Suburban", "latitude": 20.3800, "longitude": 85.8300, "base_traffic": 110, "base_aqi": 50}
]

def ensure_dataset_exists():
    if not os.path.exists(CSV_PATH):
        print(f"[Seeder] CSV dataset not found at {CSV_PATH}. Generating synthetic dataset...")
        try:
            from data.generate_dataset import save_dataset
            save_dataset()
        except Exception as e:
            print(f"[Seeder] Direct import failed: {e}. Generating programmatically...")
            os.makedirs(DATA_DIR, exist_ok=True)
            # Create dataset programmatically
            from data.generate_dataset import generate_records
            records = generate_records(5200)
            fieldnames = list(records[0].keys())
            with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(records)

def seed_database(db: Session):
    # 1. Seed Location Zones if empty
    if db.query(LocationZone).count() == 0:
        for loc in LOCATIONS_META:
            zone = LocationZone(**loc)
            db.add(zone)
        db.commit()
        print("[Seeder] Location zones seeded successfully.")

    # 2. Check if UrbanRecords already seeded
    record_count = db.query(UrbanRecord).count()
    if record_count > 0:
        print(f"[Seeder] Database already contains {record_count} urban records. Skipping seed.")
        return

    # 3. Ensure CSV exists
    ensure_dataset_exists()

    # 4. Load CSV into Database
    records_to_insert = []
    anomaly_logs_to_insert = []

    with open(CSV_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            dt = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M:%S")
            is_anom = row["is_anomaly"].lower() == "true"
            rec = UrbanRecord(
                record_code=row["record_code"],
                location_id=row["location_id"],
                location_name=row["location_name"],
                latitude=float(row["latitude"]),
                longitude=float(row["longitude"]),
                timestamp=dt,
                traffic_density=int(row["traffic_density"]),
                congestion_index=float(row["congestion_index"]),
                avg_speed_kmh=float(row["avg_speed_kmh"]),
                aqi=int(row["aqi"]),
                pm25=float(row["pm25"]),
                pm10=float(row["pm10"]),
                co2_ppm=float(row["co2_ppm"]),
                temperature_c=float(row["temperature_c"]),
                humidity_pct=float(row["humidity_pct"]),
                weather=row["weather"],
                risk_score=float(row["risk_score"]),
                is_anomaly=is_anom,
                anomaly_type=row["anomaly_type"],
                anomaly_explanation=row["anomaly_explanation"]
            )
            records_to_insert.append(rec)

    # Bulk insert in chunks for performance
    db.bulk_save_objects(records_to_insert)
    db.commit()
    print(f"[Seeder] Successfully seeded {len(records_to_insert)} records into SQLite database.")

    # 5. Populate AnomalyLogs for seeded anomalies
    anomalous_records = db.query(UrbanRecord).filter(UrbanRecord.is_anomaly == True).all()
    for rec in anomalous_records:
        severity = "Critical" if rec.risk_score > 75 else ("High" if rec.risk_score > 55 else "Medium")
        anom_log = AnomalyLog(
            record_id=rec.id,
            location_name=rec.location_name,
            anomaly_type=rec.anomaly_type,
            severity=severity,
            risk_score=rec.risk_score,
            explanation=rec.anomaly_explanation,
            detected_at=rec.timestamp
        )
        anomaly_logs_to_insert.append(anom_log)

    db.bulk_save_objects(anomaly_logs_to_insert)
    db.commit()
    print(f"[Seeder] Generated {len(anomaly_logs_to_insert)} anomaly logs.")
