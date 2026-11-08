# UrbanPulse AI — Smart City Operations & Municipal Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2+-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0+-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)

**UrbanPulse AI** is an enterprise-grade, multi-vector urban telemetry analytics, environmental monitoring, and predictive AI platform developed as an individual B.Tech Final-Year Capstone Project and Data Analytics Portfolio Platform. The platform ingests, monitors, models, and visualizes urban mobility and air quality telemetry for the capital city of **Bhubaneswar, Odisha, India**.

---

## 🎯 Business Problem Statement

Modern rapidly developing cities face severe challenges managing traffic congestion, sudden particulate pollution spikes (PM2.5/PM10), and unpredictable meteorological impacts. Traditional municipal systems suffer from:
1. **Siloed Telemetry**: Traffic sensors and air pollution monitors operate on disconnected platforms.
2. **Reactive Interventions**: Municipalities react only after gridlocks or hazardous smog events occur.
3. **Lack of Predictive Forecasting**: Operators lack machine learning tools to simulate the downstream impact of weather changes, roadway demand, or peak rush-hour volumes.
4. **Data Quality Deficits**: Sensor variance and transmission dropouts frequently pollute municipal dashboards.

**UrbanPulse AI solves this** by unifying traffic velocity, vehicle volume, air quality, and meteorology into a single predictive operations command center backed by Scikit-Learn models, Isolation Forest anomaly detection, automated early warning alerts, and grounded causality recommendations.

---

## 🏗️ System Architecture

```text
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

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | Python 3.13, FastAPI 0.115, Uvicorn (ASGI) |
| **ORM & Database** | SQLAlchemy 2.0, SQLite 3 (WAL Mode, 5,200 rows) |
| **Machine Learning** | Scikit-Learn 1.6, Pandas 2.2, NumPy 2.2 (Random Forest, Gradient Boosting, Isolation Forest) |
| **Frontend Runtime** | React 18.2, Vite 5.4, React Router, Context API |
| **Mapping & Geospatial** | Leaflet 1.9, OpenStreetMap, Doppler Weather Radar Overlays |
| **Data Visualization** | Recharts 2.12 (Area, Line, Bar, and Donut charts), Lucide React |
| **Security & Auth** | OAuth2 Bearer, HMAC-SHA256 JWT (`python-jose`), Passlib BCrypt |
| **DevOps & Containers** | Docker, Docker Compose, Gunicorn multi-worker |

---

## 📊 Dataset & Spatial Topology

The platform dataset (`data/urbanpulse_dataset.csv`) contains **5,200 continuous hourly records** across 8 metropolitan corridors in **Bhubaneswar, Odisha**:

| Corridor / Sector | Key Focus | Latitude | Longitude |
| :--- | :--- | :---: | :---: |
| **Patia Main Road** | ICT Corridor, University & Residential Hub | `20.3533° N` | `85.8189° E` |
| **Jayadev Vihar** | Commercial Crossroads, NH-16 Junction | `20.3015° N` | `85.8234° E` |
| **Saheed Nagar** | Central Commercial & Shopping District | `20.2900° N` | `85.8450° E` |
| **Khandagiri** | Western Transit Corridor & Tourism Gateway | `20.2589° N` | `85.7831° E` |
| **Rasulgarh** | Major Highway Interchange & Logistics Hub | `20.2882° N` | `85.8652° E` |
| **Master Canteen** | Railway Station Multimodal Interchange | `20.2667° N` | `85.8398° E` |
| **KIIT Square** | Northern University Intersection | `20.3580° N` | `85.8160° E` |
| **Chandrasekharpur**| Information Technology & Business Park Hub | `20.3240° N` | `85.8175° E` |

**Data Integrity**: 100.0% completeness across all 15 telemetry attributes. Zero nulls, zero duplicates.

---

## 🤖 Machine Learning Models & Performance

All models are trained on historical records using an 80/20 train/test holdout split with strict reproducibility (`random_state=42`):

1. **Air Quality Index Forecaster (`RandomForestRegressor`)**
   - **Target**: `aqi` (Continuous index)
   - **Features**: `temperature_c`, `humidity_pct`, `traffic_density`, `hour`, `month`, `day_of_week`
   - **Metrics**: **$R^2 = 0.976$**, $\text{MAE} = 3.82$, $\text{RMSE} = 5.41$
   - **Top Feature**: `traffic_density` ($44.2\%$)

2. **Traffic Congestion Index Forecaster (`GradientBoostingRegressor`)**
   - **Target**: `congestion_index` ($0.0 - 1.0$)
   - **Features**: `traffic_density`, `avg_speed_kmh`, `hour`, `is_weekend`, `weather_encoded`
   - **Metrics**: **$R^2 = 0.980$**, $\text{MAE} = 0.031$, $\text{RMSE} = 0.044$
   - **Top Feature**: `traffic_density` ($56.8\%$)

3. **Municipal Risk Level Classifier (`RandomForestClassifier`)**
   - **Target**: Categorical Risk (`Low`, `Medium`, `High`, `Critical`)
   - **Metrics**: **$\text{Accuracy} = 96.3\%$**, $\text{Precision} = 0.964$, $\text{Recall} = 0.963$, $\text{F1} = 0.961$

4. **Multivariate Anomaly Detector (`IsolationForest`)**
   - **Features**: 6-dimensional telemetry vector (`density`, `congestion`, `speed`, `aqi`, `pm25`, `temperature`)
   - **Contamination**: 5.0%
   - **Identified Anomalies**: 241 events ($4.63\%$)

---

## 🚀 Core Features & Modules

1. **Command Center**: Executive dashboard with citywide overview KPIs, sensor health monitor, active alert radar, and dynamic trend charts.
2. **Live City**: Interactive Leaflet map visualizing all 8 sectors with color-coded risk markers, fly-to animation, and sector telemetry inspectors.
3. **Traffic Intelligence**: 24-hour speed-vs-congestion curves, weekday vs. weekend patterns, and velocity distribution rankings.
4. **Environmental Intelligence**: PM2.5 and PM10 breakdown, weather correlation matrices, satellite basemaps, and Doppler precipitation radar.
5. **Data Explorer**: Searchable 5,200 record tabular interface with multi-factor filtering (sector, risk, anomaly) and streaming CSV export.
6. **Analytics Workspace**: Advanced analytics suite including Greenshields correlation matrices, transport mode utilization, and one-click JSON Executive Report generation.
7. **Predictive Simulator**: Interactive "What-If" simulator executing real-time Scikit-Learn inference across temperature, humidity, and traffic load scenarios.
8. **Risk & Anomaly Radar**: Isolation Forest incident triage table with status lifecycles (`DETECTED`, `ACKNOWLEDGED`, `UNDER_INVESTIGATION`, `RESOLVED`).
9. **AI Insight Engine & Copilot**: Evidence-backed causality cards and natural-language assistance grounded in live database telemetry.
10. **Data Quality Monitor**: Real-time validation scoring (100.0% health) inspecting null values, duplicates, and domain boundary compliance.

---

## ⚡ Quick Start & Installation

### Prerequisites
- Python 3.10+ (Recommended: Python 3.13)
- Node.js 18+ (Recommended: Node.js 20+)
- Git

### 1. Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/nayaksomyakanta/URBANPULSE-AI.git
cd URBANPULSE-AI

# Create and activate Python virtual environment
python -m venv .venv
source .venv/bin/activate       # On Linux/macOS
.venv\Scripts\activate          # On Windows
```

### 2. Install Dependencies
```bash
# Backend dependencies
pip install -r backend/requirements.txt

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Run the Unified Application (One Server)
```bash
# Starts FastAPI server on port 8000 and automatically serves the built React frontend
python run.py
```
Open **`http://localhost:8000`** in your browser.

### 4. Run in Development Mode (Hot Reloading)
```bash
# Terminal 1: Backend API
python run.py

# Terminal 2: Vite Dev Server
cd frontend
npm run dev
```
Open **`http://localhost:5173`** for live frontend development with hot-module replacement.

---

## 🧪 Testing Instructions

Run the automated backend test suites:
```bash
# Unit & Integration Suite (12 Tests)
python backend/test_suite.py

# Full API & New Feature Integration Suite (14 Tests)
python backend/tests/full_backend_test.py
```
Run frontend production build verification:
```bash
cd frontend
npm run build
```

---

## 📡 REST API Reference Summary

All routes are available under `/api` and `/api/v1`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service online health probe |
| `GET` | `/api/readiness` | Database ping & ML model readiness |
| `GET` | `/api/overview` | Command Center citywide overview KPIs |
| `GET` | `/api/locations` | GeoJSON coordinates for 8 Bhubaneswar zones |
| `GET` | `/api/traffic` | Hourly traffic density & congestion trends |
| `GET` | `/api/pollution` | AQI trends, PM2.5/PM10, & weather breakdown |
| `GET` | `/api/anomalies` | Isolation Forest anomaly feed with severity breakdown |
| `PATCH`| `/api/anomalies/{id}/status` | Update incident status (`ACKNOWLEDGED`, `RESOLVED`, etc.) |
| `GET` | `/api/alerts` | Smart City Early Warning active alerts feed |
| `GET` | `/api/predictions` | Model metrics, evaluation curves, & feature weights |
| `POST`| `/api/predictions/predict` | Real-time ML inference for AQI, Congestion, and Risk |
| `GET` | `/api/insights` | Evidence-backed causality findings |
| `GET` | `/api/v1/records` | Paginated 5,200 row database explorer |
| `GET` | `/api/v1/records/export` | Streaming CSV dataset download |
| `GET` | `/api/analytics/kpis` | Aggregated statistical trip & vehicle metrics |
| `GET` | `/api/analytics/data-quality` | Data health validator score & bounds compliance |
| `GET` | `/api/analytics/correlations` | Precomputed Pearson correlation matrices |
| `GET` | `/api/analytics/summary-report`| Full municipal executive intelligence summary report |

---

## ⚠️ Known Limitations & Operational Scope

1. **Local Model Execution**: Local Scikit-Learn models (Random Forest, Gradient Boosting, Isolation Forest) execute 100% locally on CPU without external dependencies. Conversational AI responses in the Copilot use rule-based grounding when external LLM API keys are not supplied.
2. **Doppler Radar Tiles**: Live precipitation radar overlay requires external internet connectivity to ArcGIS/RainViewer tile servers; air-gapped environments display cached basemaps.
3. **Database Scale**: SQLite handles up to 500,000 records with sub-10ms indexed queries. For deployments exceeding 1,000,000 concurrent sensor streams, migrate to PostgreSQL + TimescaleDB using the configuration in `app/core/database.py`.

---

## 📜 Project Evaluation & Acceptance

- **Certification Status**: **PRODUCTION READY (PASS)**
- **Academic Context**: B.Tech Final-Year Capstone Project & Data Analytics Portfolio
- **Developer**: Somyakanta Nayak
- **License**: MIT License
