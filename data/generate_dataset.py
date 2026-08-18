"""
UrbanPulse AI - Synthetic Development Dataset Generator
Generates 5,000+ realistic correlated urban telemetry records spanning 30 days across multiple city zones.
Clearly marked as synthetic development data for urban analytics modeling.
"""

import os
import csv
import random
import math
from datetime import datetime, timedelta

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DATA_DIR, "urbanpulse_dataset.csv")

LOCATIONS = [
    {
        "location_id": "LOC-01",
        "location_name": "Downtown Central",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "base_traffic": 180,
        "base_aqi": 75,
        "type": "Commercial"
    },
    {
        "location_id": "LOC-02",
        "location_name": "Midtown Financial",
        "latitude": 40.7589,
        "longitude": -73.9851,
        "base_traffic": 210,
        "base_aqi": 85,
        "type": "Financial"
    },
    {
        "location_id": "LOC-03",
        "location_name": "Harbor Industrial",
        "latitude": 40.6720,
        "longitude": -74.0090,
        "base_traffic": 150,
        "base_aqi": 115,
        "type": "Industrial"
    },
    {
        "location_id": "LOC-04",
        "location_name": "Tech Corridor West",
        "latitude": 40.7410,
        "longitude": -74.0040,
        "base_traffic": 130,
        "base_aqi": 55,
        "type": "Technology"
    },
    {
        "location_id": "LOC-05",
        "location_name": "North Residential",
        "latitude": 40.7900,
        "longitude": -73.9600,
        "base_traffic": 85,
        "base_aqi": 42,
        "type": "Residential"
    },
    {
        "location_id": "LOC-06",
        "location_name": "Suburb South Ridge",
        "latitude": 40.6300,
        "longitude": -74.0800,
        "base_traffic": 65,
        "base_aqi": 35,
        "type": "Suburban"
    },
    {
        "location_id": "LOC-07",
        "location_name": "Airport Transit Hub",
        "latitude": 40.6413,
        "longitude": -73.7781,
        "base_traffic": 190,
        "base_aqi": 95,
        "type": "Transit"
    },
    {
        "location_id": "LOC-08",
        "location_name": "University District",
        "latitude": 40.7290,
        "longitude": -73.9960,
        "base_traffic": 110,
        "base_aqi": 50,
        "type": "Educational"
    }
]

WEATHERS = ["Clear", "Partly Cloudy", "Rain", "Heavy Rain", "Fog", "Haze"]

def generate_records(num_records=5200):
    records = []
    start_date = datetime.now() - timedelta(days=30)
    time_step = timedelta(minutes=15)

    random.seed(42)

    for i in range(num_records):
        timestamp = start_date + (i % 2880) * time_step + timedelta(minutes=random.randint(0, 10))
        loc = LOCATIONS[i % len(LOCATIONS)]

        hour = timestamp.hour
        day_of_week = timestamp.weekday()
        is_weekend = day_of_week >= 5

        # Time-of-day traffic curve
        if 7 <= hour <= 9 or 16 <= hour <= 19:
            time_factor = 1.65 if not is_weekend else 1.15
        elif 10 <= hour <= 15:
            time_factor = 1.10
        elif 22 <= hour or hour <= 5:
            time_factor = 0.35
        else:
            time_factor = 0.85

        # Weather factor
        weather = random.choice(WEATHERS)
        if weather in ["Rain", "Heavy Rain"]:
            weather_speed_mult = 0.72
            weather_aqi_mult = 0.85
        elif weather in ["Fog", "Haze"]:
            weather_speed_mult = 0.85
            weather_aqi_mult = 1.25
        else:
            weather_speed_mult = 1.0
            weather_aqi_mult = 1.0

        # Calculate traffic density
        traffic_density = max(10, int(loc["base_traffic"] * time_factor * random.uniform(0.85, 1.2)))

        # Congestion index (0.0 to 1.0) correlated with traffic density
        congestion_index = min(0.98, max(0.05, round((traffic_density / 250.0) * random.uniform(0.85, 1.15), 2)))

        # Average speed (km/h) inversely related to congestion index
        base_speed = 65.0 if loc["type"] in ["Suburban", "Transit"] else 45.0
        avg_speed_kmh = max(6.0, round((base_speed * (1.0 - 0.7 * congestion_index)) * weather_speed_mult * random.uniform(0.9, 1.1), 1))

        # CO2 ppm (correlated with traffic density)
        co2_ppm = round(390.0 + (traffic_density * 0.9) + random.uniform(-15, 25), 1)

        # Temperature (°C) & Humidity (%)
        temp_base = 22.0 + 6.0 * math.sin((hour - 8) * math.pi / 12)
        temperature_c = round(temp_base + random.uniform(-2.5, 2.5), 1)
        humidity_pct = round(max(30.0, min(98.0, 65.0 - (temperature_c - 20) * 1.5 + (20 if weather in ["Rain", "Heavy Rain", "Fog"] else 0) + random.uniform(-5, 5))), 1)

        # AQI & PM2.5 / PM10 (correlated with traffic, co2, weather, location)
        raw_aqi = (loc["base_aqi"] * 0.4) + (traffic_density * 0.3) + (co2_ppm * 0.05)
        aqi = max(15, int(raw_aqi * weather_aqi_mult * random.uniform(0.88, 1.12)))

        pm25 = round(aqi * 0.45 + random.uniform(-4, 6), 1)
        pm10 = round(pm25 * 1.8 + random.uniform(-5, 10), 1)

        # Risk score calculation (0 - 100) combining congestion, AQI, speed, weather
        risk_raw = (congestion_index * 40.0) + (min(200, aqi) / 200.0 * 35.0) + ((50.0 - min(45.0, avg_speed_kmh)) / 50.0 * 25.0)
        risk_score = round(max(5.0, min(99.0, risk_raw)), 1)

        # Inject periodic anomalies (~4% rate)
        is_anomaly = False
        anomaly_type = "None"
        anomaly_explanation = ""

        if random.random() < 0.042:
            is_anomaly = True
            anomaly_kind = random.choice(["TRAFFIC_SPIKE", "AQI_SURGE", "SPEED_DROP", "HAZARD_COMBO"])
            if anomaly_kind == "TRAFFIC_SPIKE":
                traffic_density = int(traffic_density * 1.75)
                congestion_index = min(0.99, round(congestion_index * 1.45, 2))
                anomaly_type = "Traffic Bottleneck"
                anomaly_explanation = f"Sudden vehicular surge of {traffic_density} vehicles/min exceeding corridor capacity."
            elif anomaly_kind == "AQI_SURGE":
                aqi = int(aqi * 1.8) + 40
                pm25 = round(pm25 * 2.1, 1)
                anomaly_type = "Air Quality Hazard"
                anomaly_explanation = f"Hazardous particulate spike (AQI {aqi}, PM2.5 {pm25} µg/m³) detected near {loc['location_name']}."
            elif anomaly_kind == "SPEED_DROP":
                avg_speed_kmh = max(4.0, round(avg_speed_kmh * 0.35, 1))
                congestion_index = min(0.98, round(congestion_index * 1.3, 2))
                anomaly_type = "Severe Gridlock"
                anomaly_explanation = f"Critical speed drop to {avg_speed_kmh} km/h indicating major arterial blockade."
            else:
                risk_score = round(min(98.5, risk_score + 35.0), 1)
                anomaly_type = "Multi-Vector Urban Risk"
                anomaly_explanation = f"Combined extreme congestion ({int(congestion_index*100)}%) and high particulate pollution."

        records.append({
            "record_code": f"URB-{(i + 10001)}",
            "location_id": loc["location_id"],
            "location_name": loc["location_name"],
            "latitude": loc["latitude"],
            "longitude": loc["longitude"],
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "traffic_density": traffic_density,
            "congestion_index": congestion_index,
            "avg_speed_kmh": avg_speed_kmh,
            "aqi": aqi,
            "pm25": max(2.0, pm25),
            "pm10": max(5.0, pm10),
            "co2_ppm": co2_ppm,
            "temperature_c": temperature_c,
            "humidity_pct": humidity_pct,
            "weather": weather,
            "risk_score": risk_score,
            "is_anomaly": is_anomaly,
            "anomaly_type": anomaly_type,
            "anomaly_explanation": anomaly_explanation
        })

    return records

def save_dataset():
    records = generate_records(5200)
    os.makedirs(DATA_DIR, exist_ok=True)
    fieldnames = [
        "record_code", "location_id", "location_name", "latitude", "longitude",
        "timestamp", "traffic_density", "congestion_index", "avg_speed_kmh",
        "aqi", "pm25", "pm10", "co2_ppm", "temperature_c", "humidity_pct",
        "weather", "risk_score", "is_anomaly", "anomaly_type", "anomaly_explanation"
    ]

    with open(CSV_PATH, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"[UrbanPulse Dataset] Successfully generated {len(records)} realistic records at {CSV_PATH}")

if __name__ == "__main__":
    save_dataset()
