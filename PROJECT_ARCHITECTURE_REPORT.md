# UrbanPulse AI — Complete System Architecture Report

## 1. System Overview & Vision
UrbanPulse AI is an enterprise-grade, multi-vector urban intelligence and telemetry analytics platform designed for municipal command centers and city administrators (demonstrated on Bhubaneswar, Odisha). The platform ingests, standardizes, models, and visualizes multi-sensor urban telemetry across eight major metropolitan sectors:
- Patia Main Road (ICT & University Corridor)
- Jayadev Vihar (Commercial Crossroads)
- Saheed Nagar (Business & Administrative District)
- Khandagiri (Heritage & Western Transit Hub)
- Rasulgarh (Industrial & National Highway Transit Hub)
- Master Canteen (Railway Station Central Hub)
- KIIT Square (Educational Zone)
- Chandrasekharpur (IT Park Corridor)

The architecture bridges real-time observational data (traffic speeds, vehicle volume, AQI, PM2.5, PM10, temperature, humidity) with Scikit-Learn predictive modeling, Isolation Forest anomaly detection, automated rule-based causal insights, and conversational LLM assistance.

---

## 2. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              CLIENT-SIDE PRESENTATION                             |
|                               (React 18 + Vite SPA)                               |
|                                                                                   |
|  [ Landing Page / Citizen Portal ] <====> [ Citizen & Operator Auth / JWT ]       |
|                                     |                                             |
|                                     v                                             |
|     +----------------------------------------------------------------------+      |
|     |                     UrbanPulse Global State Layer                    |      |
|     |           (Context API: Sync, Telemetry, Active Zone, Roles)         |      |
|     +----------------------------------------------------------------------+      |
|        |                |                 |                |            |         |
|        v                v                 v                v            v         |
|  [Command Center] [Live City Map] [Traffic Intel]  [Air & Weather] [Explorer]     |
|  [Analytics WS]   [Predictions]   [Risk & Anom.]   [Insight Engine][AI Copilot]   |
+-----------------------------------------------------------------------------------+
                                       |
                         REST / JSON / Bearer JWT
                                       v
+-----------------------------------------------------------------------------------+
|                              BACKEND SERVICE RUNTIME                              |
|                          (FastAPI / Uvicorn / Python 3.13)                        |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Routers (/api and /api/v1):                                                 |  |
|  | - auth.py         - overview.py      - traffic.py      - pollution.py       |  |
|  | - explorer.py     - analytics.py     - predictions.py  - anomalies.py       |  |
|  | - insights.py     - locations.py     - trips.py        - health/readiness   |  |
|  +-----------------------------------------------------------------------------+  |
|                                       |                                           |
|       +-------------------------------+-------------------------------+           |
|       |                                                               |           |
|       v                                                               v           |
|  +----------------------------+                           +--------------------+  |
|  |  Data & Analytics Engine   |                           |  Machine Learning  |  |
|  |  - SQLAlchemy 2.0 ORM      |                           |  Inference Engine  |  |
|  |  - Aggregate Metrics       |                           |  - RandomForest    |  |
|  |  - CSV Importer & Seeder   |                           |  - GradientBoost   |  |
|  |  - Data Quality Assessor   |                           |  - IsolationForest |  |
|  +----------------------------+                           +--------------------+  |
+-----------------------------------------------------------------------------------+
          |                                                            |
          v                                                            v
+---------------------------------------+             +-----------------------------+
|          DATABASE STORAGE             |             |       PERSISTENT MODELS     |
|   SQLite: backend/data/urbanpulse.db  |             |  backend/app/ml/models/     |
|   5,200 Validated Telemetry Records   |             |  AQI, Congestion, Risk, IF  |
+---------------------------------------+             +-----------------------------+
```

---

## 3. End-to-End User Journey Trace

The user journey follows a strictly integrated 10-stage operational lifecycle:

1. **Landing Page (`/home`)**:
   - Modern, high-performance landing experience highlighting city health metrics, live platform statistics, system features, and quick entry points.
   - Dual authentication entry: Citizen User Login and Municipal Operator Portal.

2. **Authentication (`/login`, `/signup`, `/forgot-password`)**:
   - Role-Based Access Control (RBAC) supporting `CITIZEN`, `OPERATOR`, and `ADMIN`.
   - Issues signed JWT tokens using secure backend secrets (`JWT_SECRET`).
   - Graceful offline fallback profiles for testing and demonstration.

3. **Main Command Center (`/command-center`, `/dashboard`)**:
   - Unified executive dashboard aggregating citywide KPIs: Traffic Congestion Index, Citywide AQI, Severe Alerts Count, Sensor Network Health.
   - Interactive timeline controls (`1H`, `6H`, `24H`, `7D`, `30D`).
   - Integrated Bhubaneswar Leaflet live map with layer overlays.

4. **Traffic Intelligence (`/traffic`)**:
   - Real-time vehicular velocity analysis, congestion heatmaps, congestion index by time of day, and weekday vs. weekend travel comparisons.
   - Interactive zone filtering allowing pinpoint inspection across the 8 city corridors.

5. **Environmental & Weather Intelligence (`/pollution`, `/environment`, `/weather`)**:
   - Air quality monitoring for PM2.5, PM10, AQI index, and weather correlation matrices.
   - Interactive Doppler precipitation radar, satellite basemaps, temperature, humidity, and barometric telemetry.
   - Zero-silent geolocation: defaults cleanly to Bhubaneswar with user-triggered geocoding.

6. **Data Explorer (`/explorer`)**:
   - Direct tabulated interface over 5,200 municipal telemetry records.
   - Multi-parameter search, zone filtering, risk-level filtering, anomaly filtering, and one-click streaming CSV data export (`/api/v1/records/export`).

7. **Analytics Workspace (`/analytics`)**:
   - In-depth statistical analytics workbench calculating Pearson correlations between temperature and air quality, density vs. speed regressions, and modal share breakdown (Cars, Buses, 2-Wheelers, Autos, Trucks).

8. **Predictions (`/predictions`, `/ml-models`)**:
   - Interactive ML inference simulator allowing municipal operators to adjust temperature, humidity, base traffic density, and weather conditions.
   - Returns real-time forecasts from trained Scikit-Learn models with feature importance breakdowns and model evaluation metrics ($R^2$, MAE, RMSE).

9. **Risk & Anomaly Detection (`/risk`)**:
   - Isolation Forest anomaly detection engine identifying multivariate outliers in urban telemetry.
   - Real-time anomaly table with status triage actions (`NEW` -> `IN_REVIEW` -> `RESOLVED`), severity scoring, and root-cause evidence tags.

10. **AI Insight Engine & Copilot (`/insights`, `/ai-copilot`)**:
    - Automated causality engine synthesizing data patterns into actionable civic interventions (e.g., adaptive traffic signaling, dust suppression deployment).
    - Natural language AI Copilot drawer assisting operators with real-time operational queries.

---

## 4. Frontend Component & State Topology

- **Runtime**: React 18.2 with Vite 5.4.
- **State Management**: `UrbanPulseContext` providing reactive state across active tab, selected zone, authentication profile, network status, and sync triggers.
- **Styling Architecture**: Custom responsive dark-mode styling utilizing CSS variables, glassmorphic panels, and zero bulky UI kit overhead.
- **Mapping Engine**: Leaflet 1.9 with custom reactive SVG markers, radar tile layers, and dynamic coordinate centering.
- **Visualization Engine**: Recharts 2.12 powering Area, Line, Bar, and Donut compositions with responsive containers and custom hover tooltips.

---

## 5. Backend Architecture & Service Layer

- **Framework**: FastAPI (ASGI) running on Uvicorn.
- **ORM / Query Engine**: SQLAlchemy 2.0 with transactional sessions and explicit schema typing.
- **Dual Routing Compatibility**: Cleanly handles both legacy `/api/...` and standardized `/api/v1/...` REST endpoints without routing ambiguity or duplicate operation IDs.
- **Machine Learning Services**:
  - `RandomForestRegressor` for Air Quality Index (AQI) modeling.
  - `GradientBoostingRegressor` for Congestion Index forecasting.
  - `RandomForestClassifier` for Risk Level classification (Low, Medium, High, Critical).
  - `IsolationForest` for multivariate anomaly detection across 6 sensor dimensions.
  - Automatic on-demand model fitting (`ensure_trained()`) guaranteeing high availability even across fresh daemon restarts.

---

## 6. Database Storage Schema

- **Primary Entity**: `UrbanRecord` (`urban_records` table)
  - `record_id`: Integer Primary Key (Autoincrement)
  - `record_code`: String (Unique business identifier, e.g., `REC-PAT-0001`)
  - `timestamp`: DateTime (Indexed for time-series range queries)
  - `location_id`, `location_name`, `latitude`, `longitude`: Spatial indexing attributes
  - `traffic_density`, `congestion_index`, `avg_speed_kmh`: Mobility metrics
  - `aqi`, `pm25`, `pm10`: Air quality telemetry
  - `temperature_c`, `humidity_pct`, `weather`: Meteorological conditions
  - `risk_level`, `risk_score`: Municipal vulnerability scores
  - `is_anomaly`, `anomaly_type`, `anomaly_score`: Unsupervised anomaly flags
- **Status Entity**: `AnomalyRecord` (`anomaly_records` table)
  - Tracks operational triage lifecycle (`NEW`, `IN_REVIEW`, `RESOLVED`, `DISMISSED`) with audit timestamps.
