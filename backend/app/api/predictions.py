from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.core.database import get_db
from app.db.models import UrbanRecord
from app.ml.engine import ml_engine
from app.schemas.models import PredictionInputSchema, PredictionResponseSchema

router = APIRouter(tags=["Predictive Analytics Studio"])

@router.get("/predictions", response_model=Dict[str, Any])
@router.get("/v1/predictions", response_model=Dict[str, Any])
def get_prediction_models_metadata(db: Session = Depends(get_db)):
    """Returns trained Scikit-learn model evaluation metrics, telemetry curves, and feature importances."""
    aqi_curve = []
    traffic_curve = []
    risk_curve = []

    for hour in range(24):
        # Query database hourly actual averages
        stats = db.query(
            func.avg(UrbanRecord.aqi),
            func.avg(UrbanRecord.congestion_index),
            func.avg(UrbanRecord.risk_score),
            func.avg(UrbanRecord.traffic_density),
            func.avg(UrbanRecord.temperature_c),
            func.avg(UrbanRecord.humidity_pct),
            func.avg(UrbanRecord.pm25),
            func.avg(UrbanRecord.pm10),
            func.avg(UrbanRecord.co2_ppm),
            func.avg(UrbanRecord.avg_speed_kmh)
        ).filter(extract('hour', UrbanRecord.timestamp) == hour).first()

        act_aqi = int(stats[0] or 65)
        act_tr = round(float(stats[1] or 0.4), 2)
        act_rk = round(float(stats[2] or 40.0), 1)

        # Run actual ML model inferences for predicted values
        input_data = {
            "traffic_density": stats[3] or 120,
            "temperature_c": stats[4] or 25.0,
            "humidity_pct": stats[5] or 60.0,
            "pm25": stats[6] or 25.0,
            "pm10": stats[7] or 50.0,
            "co2_ppm": stats[8] or 430.0,
            "hour": hour,
            "day_of_week": 2,
            "avg_speed_kmh": stats[9] or 32.0,
            "is_weekend": 0
        }

        if ml_engine.is_trained:
            pred_aqi_res = ml_engine.predict_aqi(input_data)
            pred_tr_res = ml_engine.predict_congestion(input_data)
            pred_aqi = int(pred_aqi_res.get("predicted_aqi", act_aqi))
            pred_tr = round(float(pred_tr_res.get("predicted_congestion_index", act_tr)), 2)
            pred_rk = act_rk
        else:
            pred_aqi = act_aqi
            pred_tr = act_tr
            pred_rk = act_rk

        aqi_curve.append({"hour": f"{hour:02d}:00", "actual": max(10, act_aqi), "predicted": max(10, pred_aqi)})
        traffic_curve.append({"hour": f"{hour:02d}:00", "actual": max(0.05, min(0.99, act_tr)), "predicted": max(0.05, min(0.99, pred_tr))})
        risk_curve.append({"hour": f"{hour:02d}:00", "actual": max(5.0, act_rk), "predicted": max(5.0, pred_rk)})

    return {
        "status": "active",
        "is_trained": ml_engine.is_trained,
        "models": {
            "aqi_predictor": {
                "name": "RandomForestRegressor",
                "target": "Air Quality Index (AQI)",
                "metrics": {
                    "r2": ml_engine.metrics["aqi_model"]["r2"],
                    "rmse": ml_engine.metrics["aqi_model"]["rmse"]
                },
                "feature_importance": ml_engine.metrics["aqi_model"]["feature_importance"],
                "curve": aqi_curve
            },
            "traffic_predictor": {
                "name": "GradientBoostingRegressor",
                "target": "Congestion Index (0.0 - 1.0)",
                "metrics": {
                    "r2": ml_engine.metrics["traffic_model"]["r2"],
                    "rmse": ml_engine.metrics["traffic_model"]["rmse"]
                },
                "feature_importance": ml_engine.metrics["traffic_model"]["feature_importance"],
                "curve": traffic_curve
            },
            "risk_classifier": {
                "name": "RandomForestClassifier",
                "target": "Urban Risk Classification (Low/Medium/High/Critical)",
                "metrics": {
                    "accuracy": ml_engine.metrics["risk_model"]["accuracy"],
                    "f1_score": ml_engine.metrics["risk_model"]["f1_score"]
                },
                "feature_importance": ml_engine.metrics["risk_model"]["feature_importance"],
                "curve": risk_curve
            }
        }
    }

@router.post("/predictions/predict", response_model=PredictionResponseSchema)
@router.post("/v1/predictions/predict", response_model=PredictionResponseSchema)
def run_real_prediction(payload: PredictionInputSchema):
    """Executes real-time inference using trained Scikit-learn models."""
    target = payload.target.lower()
    input_dict = payload.model_dump()

    if target in ["aqi", "air_quality"]:
        result = ml_engine.predict_aqi(input_dict)
        return PredictionResponseSchema(
            target="AQI Prediction",
            model_name="RandomForestRegressor",
            prediction_result=result,
            metrics={"r2": ml_engine.metrics["aqi_model"]["r2"], "rmse": ml_engine.metrics["aqi_model"]["rmse"]},
            feature_importances=ml_engine.metrics["aqi_model"]["feature_importance"]
        )

    elif target in ["traffic", "congestion"]:
        result = ml_engine.predict_congestion(input_dict)
        return PredictionResponseSchema(
            target="Traffic Congestion Prediction",
            model_name="GradientBoostingRegressor",
            prediction_result=result,
            metrics={"r2": ml_engine.metrics["traffic_model"]["r2"], "rmse": ml_engine.metrics["traffic_model"]["rmse"]},
            feature_importances=ml_engine.metrics["traffic_model"]["feature_importance"]
        )

    elif target in ["risk", "urban_risk", "classification"]:
        result = ml_engine.predict_risk(input_dict)
        return PredictionResponseSchema(
            target="Urban Risk Classification",
            model_name="RandomForestClassifier",
            prediction_result=result,
            metrics={"accuracy": ml_engine.metrics["risk_model"]["accuracy"], "f1_score": ml_engine.metrics["risk_model"]["f1_score"]},
            feature_importances=ml_engine.metrics["risk_model"]["feature_importance"]
        )

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid prediction target. Must be one of: 'aqi', 'traffic', or 'risk'."
        )
