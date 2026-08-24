"""
UrbanPulse AI - Machine Learning & Analytical Insight Engine
Implements real Scikit-learn models for AQI Prediction, Traffic Congestion Prediction,
Urban Risk Classification, IsolationForest Anomaly Detection, and AI Insight generation.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier, IsolationForest
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

class UrbanPulseMLEngine:
    def __init__(self):
        self.is_trained = False
        self.aqi_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.traffic_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.anomaly_detector = IsolationForest(contamination=0.045, random_state=42)
        
        self.metrics = {
            "aqi_model": {"r2": 0.0, "rmse": 0.0, "feature_importance": []},
            "traffic_model": {"r2": 0.0, "rmse": 0.0, "feature_importance": []},
            "risk_model": {"accuracy": 0.0, "f1_score": 0.0, "feature_importance": []}
        }

    def train_models(self, records: List[Dict[str, Any]]):
        if not records or len(records) < 50:
            print("[ML Engine] Warning: Insufficient records to train ML models.")
            return

        df = pd.DataFrame(records)
        
        # Feature Engineering
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['hour'] = df['timestamp'].dt.hour
            df['day_of_week'] = df['timestamp'].dt.dayofweek
            df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        else:
            df['hour'] = 12
            df['day_of_week'] = 2
            df['is_weekend'] = 0

        # Define Risk Classes based on risk_score
        def get_risk_class(score):
            if score < 30: return "Low"
            elif score < 55: return "Medium"
            elif score < 75: return "High"
            else: return "Critical"

        df['risk_class'] = df['risk_score'].apply(get_risk_class)

        # ---------------------------------------------------------
        # 1. AQI Prediction Model (RandomForestRegressor)
        # ---------------------------------------------------------
        aqi_features = ['traffic_density', 'temperature_c', 'humidity_pct', 'pm25', 'pm10', 'co2_ppm', 'hour', 'day_of_week']
        X_aqi = df[aqi_features].fillna(0)
        y_aqi = df['aqi'].fillna(50)

        X_train_a, X_test_a, y_train_a, y_test_a = train_test_split(X_aqi, y_aqi, test_size=0.2, random_state=42)
        self.aqi_model.fit(X_train_a, y_train_a)
        y_pred_a = self.aqi_model.predict(X_test_a)

        r2_aqi = round(float(r2_score(y_test_a, y_pred_a)), 3)
        rmse_aqi = round(float(np.sqrt(mean_squared_error(y_test_a, y_pred_a))), 2)

        importances_aqi = [
            {"feature": feat, "importance": round(float(imp), 4)}
            for feat, imp in zip(aqi_features, self.aqi_model.feature_importances_)
        ]
        importances_aqi.sort(key=lambda x: x["importance"], reverse=True)

        self.metrics["aqi_model"] = {
            "r2": r2_aqi,
            "rmse": rmse_aqi,
            "feature_importance": importances_aqi
        }

        # ---------------------------------------------------------
        # 2. Traffic Congestion Prediction Model (GradientBoostingRegressor)
        # ---------------------------------------------------------
        traffic_features = ['traffic_density', 'avg_speed_kmh', 'hour', 'day_of_week', 'is_weekend', 'temperature_c', 'humidity_pct']
        X_tr = df[traffic_features].fillna(0)
        y_tr = df['congestion_index'].fillna(0.3)

        X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X_tr, y_tr, test_size=0.2, random_state=42)
        self.traffic_model.fit(X_train_t, y_train_t)
        y_pred_t = self.traffic_model.predict(X_test_t)

        r2_tr = round(float(r2_score(y_test_t, y_pred_t)), 3)
        rmse_tr = round(float(np.sqrt(mean_squared_error(y_test_t, y_pred_t))), 3)

        importances_tr = [
            {"feature": feat, "importance": round(float(imp), 4)}
            for feat, imp in zip(traffic_features, self.traffic_model.feature_importances_)
        ]
        importances_tr.sort(key=lambda x: x["importance"], reverse=True)

        self.metrics["traffic_model"] = {
            "r2": r2_tr,
            "rmse": rmse_tr,
            "feature_importance": importances_tr
        }

        # ---------------------------------------------------------
        # 3. Urban Risk Classifier Model (RandomForestClassifier)
        # ---------------------------------------------------------
        risk_features = ['aqi', 'pm25', 'congestion_index', 'traffic_density', 'co2_ppm', 'avg_speed_kmh']
        X_r = df[risk_features].fillna(0)
        y_r = df['risk_class']

        X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_r, y_r, test_size=0.2, random_state=42)
        self.risk_model.fit(X_train_r, y_train_r)
        y_pred_r = self.risk_model.predict(X_test_r)

        acc_r = round(float(accuracy_score(y_test_r, y_pred_r)), 3)
        f1_r = round(float(f1_score(y_test_r, y_pred_r, average='weighted')), 3)

        importances_r = [
            {"feature": feat, "importance": round(float(imp), 4)}
            for feat, imp in zip(risk_features, self.risk_model.feature_importances_)
        ]
        importances_r.sort(key=lambda x: x["importance"], reverse=True)

        self.metrics["risk_model"] = {
            "accuracy": acc_r,
            "f1_score": f1_r,
            "feature_importance": importances_r
        }

        # ---------------------------------------------------------
        # 4. Anomaly Detector (IsolationForest)
        # ---------------------------------------------------------
        anom_features = ['traffic_density', 'congestion_index', 'aqi', 'pm25', 'risk_score']
        X_anom = df[anom_features].fillna(0)
        self.anomaly_detector.fit(X_anom)

        self.is_trained = True
        print(f"[ML Engine] Scikit-learn ML models trained. AQI R²={r2_aqi}, Traffic R²={r2_tr}, Risk Acc={acc_r}.")

    def predict_aqi(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        features = np.array([[
            input_data.get('traffic_density', 120),
            input_data.get('temperature_c', 24.0),
            input_data.get('humidity_pct', 60.0),
            input_data.get('pm25', 25.0),
            input_data.get('pm10', 45.0),
            input_data.get('co2_ppm', 430.0),
            input_data.get('hour', 14),
            input_data.get('day_of_week', 2)
        ]])
        predicted_aqi = float(self.aqi_model.predict(features)[0])
        status = "Good" if predicted_aqi < 50 else ("Moderate" if predicted_aqi < 100 else ("Unhealthy for Sensitive Groups" if predicted_aqi < 150 else "Unhealthy"))
        
        location = input_data.get('location_name', 'Selected Zone')
        top_feat = self.metrics["aqi_model"]["feature_importance"][0]["feature"] if self.metrics["aqi_model"]["feature_importance"] else "pm25"
        impact = "High" if predicted_aqi > 100 else ("Moderate" if predicted_aqi > 50 else "Low")
        
        return {
            "predicted_aqi": round(predicted_aqi, 1),
            "status": status,
            "confidence_r2": self.metrics["aqi_model"]["r2"],
            "model_used": "RandomForestRegressor",
            "what": f"Air Quality Projection: {round(predicted_aqi, 1)} AQI ({status})",
            "where": location,
            "when": "+1 hour forecast horizon",
            "confidence": f"{int(max(0, self.metrics['aqi_model']['r2']) * 100)}%",
            "impact": impact,
            "why": f"Driven primarily by particulate payload ({top_feat}) and traffic density.",
            "recommended_action": "Deploy localized environmental monitoring and adjust signal timing if AQI > 100."
        }

    def predict_congestion(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        features = np.array([[
            input_data.get('traffic_density', 140),
            input_data.get('avg_speed_kmh', 32.0),
            input_data.get('hour', 17),
            input_data.get('day_of_week', 3),
            input_data.get('is_weekend', 0),
            input_data.get('temperature_c', 25.0),
            input_data.get('humidity_pct', 55.0)
        ]])
        predicted_congestion = float(self.traffic_model.predict(features)[0])
        predicted_congestion = max(0.05, min(0.99, round(predicted_congestion, 2)))
        status = "Fluid" if predicted_congestion < 0.35 else ("Moderate Congestion" if predicted_congestion < 0.65 else ("Heavy Gridlock" if predicted_congestion < 0.85 else "Severe Bottleneck"))
        
        location = input_data.get('location_name', 'Selected Corridor')
        top_feat = self.metrics["traffic_model"]["feature_importance"][0]["feature"] if self.metrics["traffic_model"]["feature_importance"] else "traffic_density"
        impact = "Critical" if predicted_congestion > 0.8 else ("High" if predicted_congestion > 0.6 else "Moderate")

        return {
            "predicted_congestion_index": predicted_congestion,
            "congestion_percentage": f"{int(predicted_congestion * 100)}%",
            "status": status,
            "confidence_r2": self.metrics["traffic_model"]["r2"],
            "model_used": "GradientBoostingRegressor",
            "what": f"Traffic Congestion Forecast: {int(predicted_congestion * 100)}% ({status})",
            "where": location,
            "when": "+1 hour commute window",
            "confidence": f"{int(max(0, self.metrics['traffic_model']['r2']) * 100)}%",
            "impact": impact,
            "why": f"Elevated volume along corridor combined with key feature influence ({top_feat}).",
            "recommended_action": "Reroute transit fleet and activate dynamic signal timing for key intersections."
        }

    def predict_risk(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        features = np.array([[
            input_data.get('aqi', 85),
            input_data.get('pm25', 30.0),
            input_data.get('congestion_index', 0.55),
            input_data.get('traffic_density', 150),
            input_data.get('co2_ppm', 450.0),
            input_data.get('avg_speed_kmh', 28.0)
        ]])
        predicted_class = str(self.risk_model.predict(features)[0])
        probs = self.risk_model.predict_proba(features)[0]
        classes = list(self.risk_model.classes_)
        confidence = float(np.max(probs))

        location = input_data.get('location_name', 'Metropolitan Zone')
        top_feat = self.metrics["risk_model"]["feature_importance"][0]["feature"] if self.metrics["risk_model"]["feature_importance"] else "congestion_index"

        return {
            "predicted_risk_level": predicted_class,
            "confidence_score": round(confidence, 3),
            "class_probabilities": {c: round(float(p), 3) for c, p in zip(classes, probs)},
            "model_accuracy": self.metrics["risk_model"]["accuracy"],
            "model_used": "RandomForestClassifier",
            "what": f"Urban Risk Level: {predicted_class}",
            "where": location,
            "when": "Immediate operational state",
            "confidence": f"{int(confidence * 100)}%",
            "impact": predicted_class,
            "why": f"Multi-variate interaction between {top_feat} and local environmental telemetry.",
            "recommended_action": "Increase operator monitoring and flag zone for priority response."
        }

    def detect_anomaly(self, record: Dict[str, Any]) -> Dict[str, Any]:
        features = np.array([[
            record.get('traffic_density', 100),
            record.get('congestion_index', 0.4),
            record.get('aqi', 60),
            record.get('pm25', 20.0),
            record.get('risk_score', 40.0)
        ]])
        if_score = self.anomaly_detector.decision_function(features)[0]
        is_anomaly = self.anomaly_detector.predict(features)[0] == -1

        explanation = "Normal operating parameters within baseline variance."
        anomaly_type = "None"

        if is_anomaly or record.get('congestion_index', 0) > 0.85 or record.get('aqi', 0) > 160:
            is_anomaly = True
            if record.get('congestion_index', 0) > 0.82 and record.get('avg_speed_kmh', 40) < 12:
                anomaly_type = "Traffic Bottleneck"
                explanation = f"Severe congestion ({int(record.get('congestion_index',0)*100)}%) with sharp speed drop ({record.get('avg_speed_kmh')} km/h)."
            elif record.get('aqi', 0) > 150:
                anomaly_type = "Air Quality Hazard"
                explanation = f"Unhealthy Air Quality Index spike ({record.get('aqi')} AQI, {record.get('pm25')} µg/m³ PM2.5)."
            else:
                anomaly_type = "Multi-Vector Risk Outlier"
                explanation = f"Statistical isolation anomaly detected with decision score {round(float(if_score), 3)}."

        return {
            "is_anomaly": is_anomaly,
            "anomaly_type": anomaly_type,
            "decision_score": round(float(if_score), 4),
            "explanation": explanation
        }


def generate_analytical_insights(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    AI INSIGHT ENGINE:
    Derives structured analytical insights directly from actual backend database records.
    """
    if not records:
        return []

    df = pd.DataFrame(records)
    insights = []

    # 1. Location Pollution Insights
    loc_aqi = df.groupby('location_name')['aqi'].agg(['mean', 'max', 'count']).reset_index()
    worst_loc = loc_aqi.sort_values(by='mean', ascending=False).iloc[0]
    best_loc = loc_aqi.sort_values(by='mean', ascending=True).iloc[0]
    avg_city_aqi = df['aqi'].mean()

    aqi_diff_pct = round(((worst_loc['mean'] - avg_city_aqi) / avg_city_aqi) * 100, 1)

    insights.append({
        "id": "INS-001",
        "title": f"Air Quality Hotspot in {worst_loc['location_name']}",
        "category": "Pollution",
        "what_changed": f"Average AQI in {worst_loc['location_name']} reached {int(worst_loc['mean'])} (+{aqi_diff_pct}% higher than citywide average of {int(avg_city_aqi)}).",
        "where": worst_loc['location_name'],
        "significance": "High" if aqi_diff_pct > 35 else "Moderate",
        "contributing_factors": [
            f"Sustained heavy traffic density in {worst_loc['location_name']}",
            "Local industrial emissions & vehicle idling",
            "Atmospheric stagnant air dispersion"
        ],
        "risk_level": "High" if worst_loc['mean'] > 100 else "Medium",
        "recommended_action": f"Deploy automated traffic signal optimization and issue air quality health advisory in {worst_loc['location_name']}.",
        "evidence": {
            "avg_aqi": round(float(worst_loc['mean']), 1),
            "max_aqi": int(worst_loc['max']),
            "city_avg_aqi": round(float(avg_city_aqi), 1),
            "sample_size": int(worst_loc['count'])
        },
        "evidence_type": "Statistical"
    })

    # 2. Traffic Bottleneck & Peak Hour Insight
    df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
    peak_traffic = df[df['hour'].isin([8, 9, 17, 18])]
    off_peak_traffic = df[~df['hour'].isin([8, 9, 17, 18])]

    avg_peak_cg = peak_traffic['congestion_index'].mean()
    avg_offpeak_cg = off_peak_traffic['congestion_index'].mean()
    cg_increase_pct = round(((avg_peak_cg - avg_offpeak_cg) / (avg_offpeak_cg or 0.01)) * 100, 1)

    insights.append({
        "id": "INS-002",
        "title": "Peak-Hour Commuter Congestion Surge",
        "category": "Traffic",
        "what_changed": f"Commute hours (08:00-09:00 & 17:00-18:00) showed a {cg_increase_pct}% surge in congestion index ({int(avg_peak_cg*100)}% vs off-peak {int(avg_offpeak_cg*100)}%).",
        "where": "Arterial Transit Corridors",
        "significance": "Critical" if cg_increase_pct > 60 else "High",
        "contributing_factors": [
            "Synchronized office & school commute hours",
            "Single-occupancy vehicle concentration",
            "Transit corridor bottleneck at Midtown connections"
        ],
        "risk_level": "High",
        "recommended_action": "Incentivize staggered work hours and boost public transit frequency during 07:30-09:30 and 16:30-19:00.",
        "evidence": {
            "peak_congestion_index": round(float(avg_peak_cg), 2),
            "offpeak_congestion_index": round(float(avg_offpeak_cg), 2),
            "increase_percent": cg_increase_pct
        },
        "evidence_type": "Statistical"
    })

    # 3. Weather vs Pollution Correlation Insight
    rain_df = df[df['weather'].isin(['Rain', 'Heavy Rain'])]
    clear_df = df[df['weather'] == 'Clear']

    if not rain_df.empty and not clear_df.empty:
        rain_aqi = rain_df['aqi'].mean()
        clear_aqi = clear_df['aqi'].mean()
        washout_pct = round(((clear_aqi - rain_aqi) / clear_aqi) * 100, 1)

        insights.append({
            "id": "INS-003",
            "title": "Precipitation Particulate Scavenging Effect",
            "category": "Environmental",
            "what_changed": f"Rainfall events reduced mean particulate pollution by {washout_pct}% (AQI {int(rain_aqi)} vs Clear Weather AQI {int(clear_aqi)}).",
            "where": "Metropolitan Region Wide",
            "significance": "Moderate",
            "contributing_factors": [
                "Wet deposition removing airborne PM2.5 & PM10",
                "Reduced dust resuspension from wet road surfaces"
            ],
            "risk_level": "Low",
            "recommended_action": "Utilize dry-weather street washing vehicles on non-rainy days to mimic natural particulate scavenging.",
            "evidence": {
                "rain_aqi": round(float(rain_aqi), 1),
                "clear_aqi": round(float(clear_aqi), 1),
                "clearing_effect_percent": washout_pct
            },
            "evidence_type": "Statistical"
        })

    # 4. Anomaly Risk Correlation Insight
    anom_count = len(df[df['is_anomaly'] == True])
    total_count = len(df)
    anom_rate = round((anom_count / total_count) * 100, 2)

    insights.append({
        "id": "INS-004",
        "title": f"Systemic Anomaly Rate Audit ({anom_rate}%)",
        "category": "Anomaly",
        "what_changed": f"Detected {anom_count} urban telemetry anomalies out of {total_count} records ({anom_rate}% anomaly density).",
        "where": "High-Risk Hotspot Clusters",
        "significance": "High" if anom_rate > 5.0 else "Moderate",
        "contributing_factors": [
            "Co-occurring severe traffic slowdowns and localized air quality spikes",
            "IsolationForest multivariate feature space departure"
        ],
        "risk_level": "Medium",
        "recommended_action": "Maintain automated telemetry monitoring and set proactive alert triggers for anomalies exceeding risk score > 75.",
        "evidence": {
            "total_anomalies": anom_count,
            "total_records": total_count,
            "anomaly_rate_pct": anom_rate
        },
        "evidence_type": "Predictive"
    })

    return insights

ml_engine = UrbanPulseMLEngine()
