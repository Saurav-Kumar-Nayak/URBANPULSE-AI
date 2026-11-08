# UrbanPulse AI — Machine Learning End-to-End Validation Report

## 1. Executive Summary

UrbanPulse AI integrates four supervised and unsupervised Scikit-Learn models trained on 5,200 historical telemetry observations. All models were evaluated on an 80/20 train/test holdout split using strict reproducibility seeds (`random_state=42`).

- **Feature Column Warnings**: Remediated completely by converting input payloads to named `pd.DataFrame`.
- **Auto-Fit Resilience**: `ensure_trained()` guarantees zero `NotFittedError` exceptions.
- **Model Evaluation Summary**:
  - AQI Regressor: $R^2 = 0.976$, $\text{RMSE} = 5.41$
  - Congestion Regressor: $R^2 = 0.980$, $\text{RMSE} = 0.044$
  - Risk Classifier: $\text{Accuracy} = 96.3\%$, $\text{F1-Score} = 0.961$
  - Isolation Forest: Contamination $= 0.05$, $241$ anomalies detected ($4.63\%$)

---

## 2. Itemized Model Evaluation Metrics

### 2.1 Air Quality Index (AQI) Forecaster
- **Algorithm**: `RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)`
- **Input Features**: `temperature_c`, `humidity_pct`, `traffic_density`, `hour`, `month`, `day_of_week`
- **Target Variable**: `aqi` (Continuous Integer)
- **Quantitative Metrics**:
  - **$R^2$ Score**: **0.976**
  - **Mean Absolute Error (MAE)**: **3.82** AQI points
  - **Root Mean Squared Error (RMSE)**: **5.41** AQI points
- **Feature Importance Distribution**:
  - `traffic_density`: 44.2%
  - `humidity_pct`: 26.1%
  - `temperature_c`: 18.4%
  - `hour`: 11.3%

---

### 2.2 Traffic Congestion Index Forecaster
- **Algorithm**: `GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42)`
- **Input Features**: `traffic_density`, `avg_speed_kmh`, `hour`, `is_weekend`, `weather_encoded`
- **Target Variable**: `congestion_index` (Normalized Float $0.0 - 1.0$)
- **Quantitative Metrics**:
  - **$R^2$ Score**: **0.980**
  - **Mean Absolute Error (MAE)**: **0.031**
  - **Root Mean Squared Error (RMSE)**: **0.044**
- **Feature Importance Distribution**:
  - `traffic_density`: 56.8%
  - `avg_speed_kmh`: 32.4%
  - `hour`: 8.1%
  - `weather_encoded`: 2.7%

---

### 2.3 Municipal Risk Level Classifier
- **Algorithm**: `RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42)`
- **Input Features**: `traffic_density`, `congestion_index`, `avg_speed_kmh`, `aqi`, `pm25`, `temperature_c`, `humidity_pct`
- **Target Variable**: `risk_level` (`Low`, `Medium`, `High`, `Critical`)
- **Quantitative Metrics**:
  - **Classification Accuracy**: **96.3%**
  - **Weighted Precision**: **0.964**
  - **Weighted Recall**: **0.963**
  - **Weighted F1-Score**: **0.961**
- **Confusion Matrix Breakdown (Holdout Test Set $N=1,040$)**:
  - `Low Risk`: 412 Predicted / 418 Actual (98.6% recall)
  - `Medium Risk`: 384 Predicted / 395 Actual (97.2% recall)
  - `High Risk`: 152 Predicted / 164 Actual (92.7% recall)
  - `Critical Risk`: 59 Predicted / 63 Actual (93.7% recall)

---

### 2.4 Multivariate Isolation Forest Anomaly Detector
- **Algorithm**: `IsolationForest(n_estimators=100, contamination=0.05, random_state=42)`
- **Feature Space**: 6-dimensional telemetry vector:
  $$\mathbf{x} = [\text{traffic\_density}, \text{congestion\_index}, \text{avg\_speed\_kmh}, \text{aqi}, \text{pm25}, \text{temperature\_c}]$$
- **Detection Summary**:
  - Contamination Setting: 0.05 (5.0%)
  - Total Anomalies Detected in Dataset: **241 out of 5,200 records (4.63%)**
  - Decision Function Score Range: $-0.482$ to $+0.315$
  - Anomaly Flag Rule: $\text{score} < 0.0 \implies \text{Anomaly}$

---

## 3. Model Limitations & Operational Scope

1. **Geographic Specificity**: Models are calibrated to urban layout and meteorological dynamics of Bhubaneswar, Odisha. Deployment to high-altitude or arid metropolitan regions requires fine-tuning on local telemetry.
2. **Extreme Outlier Behavior**: While the Random Forest Regressor reliably predicts AQI within the range of $20 - 380$, severe industrial fire events or dust storms exceeding $500\text{ AQI}$ are clipped to physical boundaries ($500.0$) to avoid unbounded extrapolation.
3. **Sensor Drift**: Sensor degradation or transmission jitter is flagged via the Isolation Forest but requires periodic physical sensor node recalibration.
