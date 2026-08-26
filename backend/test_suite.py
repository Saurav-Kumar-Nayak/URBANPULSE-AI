import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure backend folder is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.core.database import SessionLocal, engine, Base
from app.db.seeder import seed_database
from app.db.models import UrbanRecord
from app.ml.engine import ml_engine

class TestUrbanPulseBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.db = SessionLocal()
        seed_database(cls.db)
        
        # Train ML engine for testing environment
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
                "hour": r.timestamp.hour,
                "day_of_week": r.timestamp.weekday(),
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

    def test_01_root_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "online")

    def test_02_overview_endpoint(self):
        res = self.client.get("/api/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_records", data)
        self.assertGreater(data["total_records"], 0)
        self.assertEqual(data["active_zones"], 8)

    def test_03_locations_endpoint(self):
        res = self.client.get("/api/locations")
        self.assertEqual(res.status_code, 200)
        locations = res.json()
        self.assertEqual(len(locations), 8)
        loc_names = [l["location_name"] for l in locations]
        self.assertIn("Patia Main Road", loc_names)
        self.assertIn("Saheed Nagar", loc_names)

    def test_04_auth_login_operator(self):
        res = self.client.post("/api/auth/login", json={"username": "operator", "password": "urbanpulse2026"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "OPERATOR")

    def test_05_predictions_metadata(self):
        res = self.client.get("/api/predictions")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "active")
        self.assertTrue(data["is_trained"])
        self.assertIn("curve", data["models"]["aqi_predictor"])
        curve = data["models"]["aqi_predictor"]["curve"]
        self.assertEqual(len(curve), 24)

    def test_06_predict_live(self):
        payload = {
            "target": "risk",
            "traffic_density": 160,
            "congestion_index": 0.65,
            "aqi": 95,
            "weather": "Clear",
            "temperature_c": 28.0,
            "humidity_pct": 60.0
        }
        res = self.client.post("/api/predictions/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["target"], "Urban Risk Classification")
        self.assertIn("predicted_risk_level", data["prediction_result"])

if __name__ == "__main__":
    unittest.main()
