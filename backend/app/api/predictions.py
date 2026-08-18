from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.ml.engine import ml_engine
from app.schemas.models import PredictionInputSchema, PredictionResponseSchema

router = APIRouter(tags=["Predictive Analytics Studio"])

@router.get("/predictions", response_model=Dict[str, Any])
@router.get("/v1/predictions", response_model=Dict[str, Any])
def get_prediction_models_metadata():
    """Returns trained Scikit-learn model evaluation metrics and feature importances."""
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
                "feature_importance": ml_engine.metrics["aqi_model"]["feature_importance"]
            },
            "traffic_predictor": {
                "name": "GradientBoostingRegressor",
                "target": "Congestion Index (0.0 - 1.0)",
                "metrics": {
                    "r2": ml_engine.metrics["traffic_model"]["r2"],
                    "rmse": ml_engine.metrics["traffic_model"]["rmse"]
                },
                "feature_importance": ml_engine.metrics["traffic_model"]["feature_importance"]
            },
            "risk_classifier": {
                "name": "RandomForestClassifier",
                "target": "Urban Risk Classification (Low/Medium/High/Critical)",
                "metrics": {
                    "accuracy": ml_engine.metrics["risk_model"]["accuracy"],
                    "f1_score": ml_engine.metrics["risk_model"]["f1_score"]
                },
                "feature_importance": ml_engine.metrics["risk_model"]["feature_importance"]
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
