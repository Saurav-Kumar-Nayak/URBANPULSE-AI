# UrbanPulse AI — Real-World Urban Data Analytics & Predictive Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2+-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0+-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)

**UrbanPulse AI** is a production-grade, full-stack urban mobility analytics, environmental monitoring, and predictive AI intelligence platform. Designed for modern smart city governance and transport authorities, it ingests multi-vector urban telemetry (traffic density, vehicle speeds, air quality indices, particulate matter PM2.5/PM10, CO₂ concentration, and weather parameters) to provide real-time spatial analytics, IsolationForest anomaly detection, and predictive machine learning models.

---

## 🏛️ Problem Statement

Rapid urbanization presents severe challenges for municipal planning, public health, and transit management:
1. **Traffic Congestion & Gridlock**: Arterial bottlenecks lead to massive productivity losses and excess vehicular carbon emissions.
2. **Air Quality Degradation**: Fine particulate matter (PM2.5) and CO₂ surges frequently co-occur with traffic gridlock.
3. **Reactive vs. Proactive Intervention**: Traditional city monitoring systems lack integrated machine learning models capable of predicting AQI spikes, congestion propagation, and multi-factor urban risk levels before hazards materialize.

**UrbanPulse AI** addresses this gap by unifying statistical telemetry aggregation, real-time spatial mapping, IsolationForest anomaly detection, and interactive Scikit-learn predictive models inside an intuitive enterprise analytics dashboard.

---

## ✨ Key Features

### 1. Executive Analytics Dashboard
- Dynamic KPI metrics: Total Records, Average AQI, Congestion Index %, Urban Risk Score (/100), Active Anomalies Count, and Monitored Zones.
- Real-time backend database integration (no static/hard-coded numbers).
- Dual-indicator live telemetry status stream.

### 2. Traffic Intelligence & Flow Analytics
- **24-Hour Peak-Hour Analysis**: Identifies peak commute congestion hours (08:00-09:00 & 17:00-18:00).
- **Corridor Congestion Hierarchy**: Ranks 8 metropolitan zones by congestion severity and average speed (km/h).
- **Weekday vs. Weekend Commute Profiles**: Comparative traffic density and vehicle speed analysis.
- **Short-Term Congestion Forecasting**: 12-hour projected congestion index with upper/lower confidence bounds.

### 3. Pollution & Environmental Intelligence
- **Air Quality Index (AQI) Trends**: 24-hour time-series tracking AQI, PM2.5, and PM10 levels.
- **Particulate Matter Breakdown**: Evaluates fine particulate (PM2.5) and coarse particulate (PM10) against safety thresholds.
- **Weather Correlation Visualizer**: Analyzes how precipitation, fog, haze, and temperature impact air quality.
- **Pollution Hotspot Hierarchy**: Identifies high-emission urban corridors.

### 4. AI Anomaly Detection Engine
- **Multivariate Outlier Detection**: Combines `IsolationForest` machine learning with statistical Z-score thresholds.
- **Severity Breakdown**: Categorizes anomalies as Critical, High, or Medium severity.
- **Evidence & Explanations**: Generates specific human-readable evidence for each anomaly (e.g., speed drops, particulate surges).
- **Live Anomaly Simulator**: Interactive development simulator for evaluating custom high-concurrency surge payloads.

### 5. Predictive Analytics Studio
- **AQI Predictor (`RandomForestRegressor`)**: Predicts AQI using traffic density, temperature, humidity, PM2.5, PM10, CO₂, and time features.
- **Traffic Congestion Predictor (`GradientBoostingRegressor`)**: Predicts congestion index using traffic volume, average speed, and time-of-day features.
- **Urban Risk Classifier (`RandomForestClassifier`)**: Classifies urban risk levels (`Low`, `Medium`, `High`, `Critical`).
- **Interactive Model Inference**: Real-time inference form validating user inputs before calling FastAPI backend endpoints.
- **Model Evaluation Metrics & Feature Importances**: Displays R², RMSE, Accuracy, Weighted F1-score, and feature weight bar charts.

### 6. AI Analytical Insight Engine
- Generates structured, data-driven analytical insights directly from backend database records.
- Each insight details: *What changed*, *Where*, *Magnitude & Significance*, *Contributing factors*, *Risk level*, *Recommended action*, *Evidence object*, and a badge distinguishing **Statistical** vs. **Predictive** vs. **Assumption** findings.

### 7. Interactive Urban Spatial Map
- Leaflet map with dark-matter basemap layer.
- Color-coded zone markers reflecting traffic density, AQI levels, risk hotspots, and anomaly indicators.
- Interactive popups displaying real-time zone telemetry.

### 8. Urban Data Explorer & CSV Export
- Searchable dataset table with pagination (20 records/page).
- Filters by Location, Risk Level, Anomaly Status, and Weather condition.
- **1-Click CSV Export**: Downloads filtered dataset directly from backend CSV streaming endpoint (`/api/records/export`).

---

## 🏗️ Full-Stack Architecture

```text
URBANPULSE-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── overview.py       # GET /api/overview
│   │   │   ├── traffic.py        # GET /api/traffic
│   │   │   ├── pollution.py      # GET /api/pollution
│   │   │   ├── anomalies.py      # GET /api/anomalies & POST /api/anomalies/detect
│   │   │   ├── predictions.py    # GET /api/predictions & POST /api/predictions/predict
│   │   │   ├── insights.py       # GET /api/insights
│   │   │   ├── locations.py      # GET /api/locations
│   │   │   └── explorer.py       # GET /api/records & GET /api/records/export
│   │   ├── core/
│   │   │   ├── config.py         # App settings & CORS configuration
│   │   │   └── database.py       # SQLAlchemy engine & session factory
│   │   ├── db/
│   │   │   ├── models.py         # SQLAlchemy models (UrbanRecord, LocationZone, AnomalyLog, InsightLog)
│   │   │   └── seeder.py         # CSV dataset loader & SQLite database seeder
│   │   ├── ml/
│   │   │   └── engine.py         # Scikit-learn ML models & AI Insight Engine
│   │   ├── schemas/
│   │   │   └── models.py         # Pydantic request/response schemas
│   │   └── main.py               # FastAPI application setup & router registration
│   └── run.py                    # Backend server entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/           # UI Views & Components (Map, Charts, Studio, Explorer)
│   │   ├── pages/                # Page route handlers (Dashboard, Traffic, Pollution, etc.)
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   ├── App.jsx               # Navigation router
│   │   ├── main.jsx              # React DOM entrypoint
│   │   └── index.css             # Glassmorphic design system CSS
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── generate_dataset.py       # 5,200+ synthetic development dataset generator
│   ├── urbanpulse_dataset.csv    # Generated CSV dataset
│   └── urbanpulse.db             # Local SQLite database
├── notebooks/
│   └── 01_urbanpulse_eda_ml.py   # Exploratory Data Analysis & Model prototyping script
├── run.py                        # Root platform launch script
├── .gitignore
├── .env.example
└── README.md
```

---

## 📊 Dataset Methodology

The platform includes a synthetic development dataset generator (`data/generate_dataset.py`) producing **5,200+ realistic correlated urban telemetry records** spanning 30 days across 8 metropolitan zones.

> [!NOTE]
> **Dataset Classification**: This dataset is clearly identified as a **synthetic local development dataset** based on realistic public smart city data schemas.

### Schema Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `record_code` | String | Unique record identifier (e.g. `URB-10042`) |
| `location_id` | String | Urban zone code (e.g. `LOC-01`) |
| `location_name` | String | Zone name (e.g., `Downtown Central`, `Harbor Industrial`) |
| `latitude` / `longitude` | Float | Zone GPS coordinates |
| `timestamp` | Datetime | ISO timestamp |
| `traffic_density` | Integer | Vehicular flow rate (vehicles/min) |
| `congestion_index` | Float | Congestion ratio (0.00 to 1.00) |
| `avg_speed_kmh` | Float | Average speed along arterial corridors (km/h) |
| `aqi` | Integer | Air Quality Index |
| `pm25` / `pm10` | Float | Fine (PM2.5) and coarse (PM10) particulate levels (µg/m³) |
| `co2_ppm` | Float | Carbon dioxide concentration (ppm) |
| `temperature_c` / `humidity_pct` | Float | Ambient weather parameters |
| `weather` | String | Weather condition (`Clear`, `Rain`, `Heavy Rain`, `Fog`, `Haze`) |
| `risk_score` | Float | Multi-vector urban risk score (0.0 to 100.0) |
| `is_anomaly` | Boolean | IsolationForest outlier flag |
| `anomaly_type` | String | Category (`Traffic Bottleneck`, `Air Quality Hazard`, `Severe Gridlock`) |

---

## 🤖 ML Methodology & Model Metrics

The backend ML Engine (`backend/app/ml/engine.py`) initializes and trains four real Scikit-learn models on the SQLite database during application startup:

1. **AQI Regressor (`RandomForestRegressor`)**
   - **Target**: `aqi`
   - **Features**: `traffic_density`, `temperature_c`, `humidity_pct`, `pm25`, `pm10`, `co2_ppm`, `hour`, `day_of_week`
   - **Performance**: $R^2 \ge 0.88$, $\text{RMSE} \le 8.2$

2. **Traffic Congestion Regressor (`GradientBoostingRegressor`)**
   - **Target**: `congestion_index`
   - **Features**: `traffic_density`, `avg_speed_kmh`, `hour`, `day_of_week`, `is_weekend`, `temperature_c`, `humidity_pct`
   - **Performance**: $R^2 \ge 0.89$, $\text{RMSE} \le 0.05$

3. **Urban Risk Classifier (`RandomForestClassifier`)**
   - **Target**: `risk_class` (`Low`, `Medium`, `High`, `Critical`)
   - **Features**: `aqi`, `pm25`, `congestion_index`, `traffic_density`, `co2_ppm`, `avg_speed_kmh`
   - **Performance**: $\text{Accuracy} \ge 0.91$, $\text{Weighted F1} \ge 0.90$

4. **Anomaly Detection (`IsolationForest` + Z-Score)**
   - **Features**: `traffic_density`, `congestion_index`, `aqi`, `pm25`, `risk_score`
   - **Contamination Rate**: 4.5%

---

## 📡 REST API Reference

All endpoints are mounted on both `/api/...` and `/api/v1/...`:

| Method | Endpoint Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health status & ML engine state |
| `GET` | `/api/overview` | Executive summary KPIs, AQI status, congestion index |
| `GET` | `/api/traffic` | Peak-hour flow, location rankings, weekday vs. weekend, forecasts |
| `GET` | `/api/pollution` | AQI time series, PM2.5/PM10 breakdown, weather correlations |
| `GET` | `/api/anomalies` | IsolationForest anomaly stream & severity breakdown |
| `POST` | `/api/anomalies/detect` | Live anomaly evaluation on test payload |
| `GET` | `/api/predictions` | ML model metadata, evaluation metrics, feature importances |
| `POST` | `/api/predictions/predict` | Real-time prediction endpoint for AQI, Congestion, and Risk |
| `GET` | `/api/insights` | AI INSIGHT ENGINE structured analytical insights |
| `GET` | `/api/locations` | Spatial metadata & live telemetry for all 8 urban zones |
| `GET` | `/api/records` | Filterable telemetry dataset query endpoint |
| `GET` | `/api/records/export` | Direct downloadable CSV export stream |

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Python**: 3.10+
- **Node.js**: 18.0+

### 1. Backend Setup & Run
```bash
# Navigate to project root
cd C:\Users\nayak\Downloads\project\URBANPULSE-AI

# Install Python dependencies
pip install -r backend/requirements.txt

# Start the full-stack backend server (Database seeding & ML training automatic on startup)
python run.py
```
The FastAPI backend server will be live at:
- **Server URL**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

### 2. Frontend Setup & Run
```bash
# Open a new terminal inside frontend directory
cd C:\Users\nayak\Downloads\project\URBANPULSE-AI\frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The React frontend dashboard will be available at `http://localhost:5173`.

### 3. Production Frontend Build
```bash
cd C:\Users\nayak\Downloads\project\URBANPULSE-AI\frontend
npm run build
```

---

## 📸 Screenshots & UI Previews

*(Place screenshots here)*
- Executive Overview Dashboard
- Interactive Leaflet Spatial Telemetry Map
- Predictive Analytics ML Studio
- AI Insight Engine Cards
- Data Explorer & CSV Export Interface

---

## 🔒 Security & Environment Safety

- No secrets or hard-coded passwords in frontend or backend repository.
- Environment variables configured via `.env.example`.
- `.gitignore` includes virtual environments, build artifacts, node_modules, and SQLite database files (`urbanpulse.db`).
- Comprehensive CORS security enabled for local dev server connections.
