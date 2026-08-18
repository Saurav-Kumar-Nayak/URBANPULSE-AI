import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from typing import Dict, Any, List

class MobilityAnomalyEngine:
    def __init__(self):
        self.model = IsolationForest(n_estimators=100, contamination=0.04, random_state=42)
        self.is_trained = False
        self.feature_names = ['distance_km', 'duration_min', 'fare_amount', 'avg_speed_kmh', 'congestion_index']

    def train(self, trips_data: List[Dict[str, Any]]):
        if not trips_data:
            return
        df = pd.DataFrame(trips_data)
        X = df[self.feature_names].fillna(0)
        self.model.fit(X)
        self.is_trained = True

    def predict_trip(self, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates a single trip payload for anomalies using trained model & heuristic rules.
        """
        dist = float(trip_data.get('distance_km', 0))
        dur = float(trip_data.get('duration_min', 0))
        fare = float(trip_data.get('fare_amount', 0))
        speed = float(trip_data.get('avg_speed_kmh', 0))
        congestion = float(trip_data.get('congestion_index', 0.5))

        features = np.array([[dist, dur, fare, speed, congestion]])

        # Rule checks for instant deterministic edge cases
        anomalies_found = []
        severity = "Low"
        risk_score = 15.0

        if dist > 0:
            expected_fare = 3.0 + (dist * 2.2) + (dur * 0.35)
            fare_ratio = fare / max(1.0, expected_fare)
            if fare_ratio > 3.0:
                anomalies_found.append(f"Fare ratio is {round(fare_ratio, 1)}x baseline expected (${round(expected_fare, 2)})")
                risk_score = max(risk_score, min(99.0, fare_ratio * 25.0))
                severity = "Critical" if fare_ratio > 5.0 else "High"

        if speed > 110.0:
            anomalies_found.append(f"Extreme urban speed of {speed} km/h recorded")
            risk_score = max(risk_score, min(98.0, speed * 0.7))
            severity = "Critical"
        elif speed < 2.0 and dist > 3.0:
            anomalies_found.append(f"Impossibly slow telemetry speed ({speed} km/h) for long distance ({dist} km)")
            risk_score = max(risk_score, 75.0)
            severity = "Medium"

        if self.is_trained:
            try:
                raw_score = float(self.model.decision_function(features)[0]) # Higher is normal, lower is anomalous
                # Convert raw_score (approx -0.3 to 0.3) to 0..1 anomaly probability
                ml_risk = max(0.0, min(100.0, (0.2 - raw_score) * 150.0))
                risk_score = max(risk_score, ml_risk)
            except Exception:
                pass

        is_anomaly = risk_score >= 60.0
        
        if not anomalies_found and is_anomaly:
            anomalies_found.append("Multivariate feature vector deviated significantly from baseline cluster.")

        if risk_score > 85:
            severity = "Critical"
        elif risk_score > 70:
            severity = "High"
        elif risk_score > 50:
            severity = "Medium"

        return {
            "is_anomaly": is_anomaly,
            "risk_score": round(risk_score, 1),
            "severity": severity,
            "anomaly_type": anomalies_found[0].split()[0] + " Anomaly" if anomalies_found else "Normal Telemetry",
            "explanation": " | ".join(anomalies_found) if anomalies_found else "Trip metrics are within normal parameters."
        }

anomaly_engine = MobilityAnomalyEngine()
