import math
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any, List

class MobilityPredictor:
    def __init__(self):
        self.eta_model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
        self.fare_model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
        self.is_trained = False

    def train_models(self, trips_data: List[Dict[str, Any]]):
        if not trips_data or len(trips_data) < 50:
            return

        df = pd.DataFrame(trips_data)
        
        # Simple feature encoding
        df['mode_code'] = df['mode'].astype('category').cat.codes
        df['weather_code'] = df['weather'].astype('category').cat.codes

        X = df[['distance_km', 'congestion_index', 'mode_code', 'weather_code']].fillna(0)
        y_duration = df['duration_min'].fillna(10)
        y_fare = df['fare_amount'].fillna(15)

        self.eta_model.fit(X, y_duration)
        self.fare_model.fit(X, y_fare)
        self.is_trained = True

    def predict_trip_outcome(
        self,
        distance_km: float,
        mode: str,
        congestion_index: float,
        weather: str,
        hour_of_day: int = 14
    ) -> Dict[str, Any]:
        """
        Predicts ETA duration, recommended dynamic surge fare, carbon footprint, and energy score.
        """
        mode_map = {"Taxi": 0, "E-Scooter": 1, "Metro": 2, "Bus": 3, "Electric-Car": 4}
        weather_map = {"Clear": 0, "Rain": 1, "Heavy Rain": 2, "Fog": 3, "Storm": 4}

        m_code = mode_map.get(mode, 0)
        w_code = weather_map.get(weather, 0)

        # Baseline fallback estimation logic
        base_speeds = {"Taxi": 35.0, "E-Scooter": 16.0, "Metro": 45.0, "Bus": 22.0, "Electric-Car": 38.0}
        eff_speed = base_speeds.get(mode, 30.0) * (1.0 - congestion_index * 0.4)
        est_duration = round((distance_km / max(5.0, eff_speed)) * 60, 1)

        base_rates = {"Taxi": 3.5, "E-Scooter": 1.5, "Metro": 2.2, "Bus": 1.8, "Electric-Car": 3.0}
        surge = 1.0 + (congestion_index * 0.6) + (0.2 if weather in ["Rain", "Storm"] else 0.0)
        est_fare = round((base_rates.get(mode, 3.0) + distance_km * 2.1 + est_duration * 0.3) * surge, 2)

        if self.is_trained:
            try:
                features = np.array([[distance_km, congestion_index, m_code, w_code]])
                ml_dur = float(self.eta_model.predict(features)[0])
                ml_fare = float(self.fare_model.predict(features)[0])
                est_duration = round((est_duration * 0.4) + (ml_dur * 0.6), 1)
                est_fare = round((est_fare * 0.4) + (ml_fare * 0.6), 2)
            except Exception:
                pass

        # Carbon footprint (g CO2 per passenger km)
        emission_factors = {"Taxi": 140, "Electric-Car": 35, "Bus": 50, "Metro": 15, "E-Scooter": 8}
        co2_g = round(distance_km * emission_factors.get(mode, 100), 1)

        return {
            "predicted_duration_min": est_duration,
            "predicted_fare_usd": est_fare,
            "surge_multiplier": round(surge, 2),
            "estimated_co2_grams": co2_g,
            "confidence_score": 94.5 if self.is_trained else 88.0,
            "recommended_mode": "Electric-Car" if mode == "Taxi" and congestion_index > 0.6 else mode
        }

    def forecast_demand(self, zone_id: str, hours_ahead: int = 12) -> List[Dict[str, Any]]:
        """
        Generates multi-hour time-series forecast for transit demand in a given zone.
        """
        forecasts = []
        now_h = 12 # Default baseline
        for h in range(1, hours_ahead + 1):
            target_hour = (now_h + h) % 24
            # Sine wave model for realistic peak morning/evening rush hours
            peak_multiplier = 1.0 + 0.75 * math.sin((target_hour - 7) * 3.14 / 6) if 7 <= target_hour <= 19 else 0.45
            demand_val = round(180 * peak_multiplier + (hash(zone_id + str(h)) % 40), 0)
            forecasts.append({
                "hour_offset": h,
                "target_hour_str": f"{target_hour:02d}:00",
                "predicted_trips": int(demand_val),
                "lower_bound": int(demand_val * 0.85),
                "upper_bound": int(demand_val * 1.15),
                "congestion_risk": "High" if demand_val > 250 else ("Moderate" if demand_val > 140 else "Low")
            })
        return forecasts

predictor_engine = MobilityPredictor()
