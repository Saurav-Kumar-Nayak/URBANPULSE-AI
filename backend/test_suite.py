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

    def test_07_readiness_endpoint(self):
        res = self.client.get("/api/readiness")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["ready"])
        self.assertTrue(data["database_connected"])
        self.assertEqual(data["status"], "OPERATIONAL")

    def test_08_data_quality_validator(self):
        from app.ml.data_quality import data_quality_validator
        valid_rec = {"aqi": 80, "pm25": 25.5, "temperature_c": 25.0, "humidity_pct": 50.0}
        is_valid, violations = data_quality_validator.validate_record(valid_rec)
        self.assertTrue(is_valid)
        self.assertEqual(len(violations), 0)

        invalid_rec = {"aqi": 999, "pm25": -10.0, "temperature_c": 100.0}
        is_valid_inv, violations_inv = data_quality_validator.validate_record(invalid_rec)
        self.assertFalse(is_valid_inv)
        self.assertGreater(len(violations_inv), 0)

    def test_09_incident_lifecycle_status_update(self):
        # Fetch an anomaly ID
        res_list = self.client.get("/api/anomalies?limit=1")
        self.assertEqual(res_list.status_code, 200)
        anomalies = res_list.json()["recent_anomalies"]
        if anomalies:
            anom_id = anomalies[0]["id"]
            res_patch = self.client.patch(f"/api/anomalies/{anom_id}/status", json={"status": "ACKNOWLEDGED"})
            self.assertEqual(res_patch.status_code, 200)
            self.assertEqual(res_patch.json()["updated_status"], "ACKNOWLEDGED")

    def test_10_invalid_prediction_input(self):
        res = self.client.post("/api/predictions/predict", json={"target": "invalid_target"})
        self.assertEqual(res.status_code, 400)

    def test_11_anomalies_location_filter(self):
        res = self.client.get("/api/anomalies?location=Patia")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("recent_anomalies", data)

    def test_12_nonexistent_anomaly_id_404(self):
        res = self.client.patch("/api/anomalies/999999/status", json={"status": "RESOLVED"})
        self.assertEqual(res.status_code, 404)

if __name__ == "__main__":
    unittest.main()
