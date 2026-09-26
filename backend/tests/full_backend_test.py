import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from app.core.database import SessionLocal, engine, Base
from app.db.seeder import seed_database
from app.db.models import UrbanRecord
from app.ml.engine import ml_engine

class FullBackendTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.db = SessionLocal()
        seed_database(cls.db)
        
        # Train ML engine for test environment
        records = cls.db.query(UrbanRecord).all()
        records_data = [
            {
                "traffic_density": r.traffic_density,
                "congestion_index": r.congestion_index,
                "avg_speed_kmh": r.avg_speed_kmh,
                "aqi": r.aqi,
                "pm25": r.pm25,
                "pm10": r.pm10,
                "co2_ppm": r.co2_ppm,
                "temperature_c": r.temperature_c,
                "humidity_pct": r.humidity_pct,
                "hour": r.timestamp.hour if r.timestamp else 12,
                "day_of_week": r.timestamp.weekday() if r.timestamp else 0,
                "is_anomaly": r.is_anomaly,
                "risk_score": r.risk_score
            }
            for r in records
        ]
        ml_engine.train_models(records_data)
        
        cls.client_cm = TestClient(app)
        cls.client = cls.client_cm.__enter__()

    @classmethod
    def tearDownClass(cls):
        cls.client_cm.__exit__(None, None, None)
        cls.db.close()

    def test_01_backend_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "online")
        self.assertTrue(data["ml_engine_trained"])

    def test_02_backend_readiness(self):
        res = self.client.get("/api/readiness")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["ready"])
        self.assertTrue(data["database_connected"])
        self.assertEqual(data["status"], "OPERATIONAL")

    def test_03_database_connectivity_and_overview(self):
        res = self.client.get("/api/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["total_records"], 0)
        self.assertEqual(data["active_zones"], 8)

    def test_04_city_locations_endpoint(self):
        res = self.client.get("/api/locations")
        self.assertEqual(res.status_code, 200)
        locations = res.json()
        self.assertEqual(len(locations), 8)
        loc_names = [loc["location_name"] for loc in locations]
        self.assertIn("Patia Main Road", loc_names)

    def test_05_traffic_intelligence_endpoint(self):
        res = self.client.get("/api/v1/traffic")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("hourly_trends", data)

    def test_06_pollution_intelligence_endpoint(self):
        res = self.client.get("/api/v1/pollution")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("aqi_trends", data)

    def test_07_risk_and_anomaly_endpoint(self):
        res = self.client.get("/api/anomalies")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("recent_anomalies", data)

    def test_08_ml_prediction_validity(self):
        payload = {
            "target": "risk",
            "traffic_density": 150,
            "congestion_index": 0.70,
            "aqi": 110,
            "weather": "Clear",
            "temperature_c": 29.0,
            "humidity_pct": 55.0
        }
        res = self.client.post("/api/predictions/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["target"], "Urban Risk Classification")
        self.assertIn("predicted_risk_level", data["prediction_result"])

    def test_09_incident_lifecycle_status_update(self):
        res_list = self.client.get("/api/anomalies?limit=1")
        self.assertEqual(res_list.status_code, 200)
        anomalies = res_list.json()["recent_anomalies"]
        if anomalies:
            anom_id = anomalies[0]["id"]
            res_patch = self.client.patch(f"/api/anomalies/{anom_id}/status", json={"status": "ACKNOWLEDGED"})
            self.assertEqual(res_patch.status_code, 200)
            self.assertEqual(res_patch.json()["updated_status"], "ACKNOWLEDGED")

    def test_10_explorer_pagination(self):
        res = self.client.get("/api/v1/records?page=1&page_size=10")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("records", data)
        self.assertEqual(len(data["records"]), 10)

    def test_11_analytics_kpis(self):
        res = self.client.get("/api/analytics/kpis")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_trips", data)
        self.assertIn("avg_congestion_index", data)

if __name__ == "__main__":
    unittest.main()
