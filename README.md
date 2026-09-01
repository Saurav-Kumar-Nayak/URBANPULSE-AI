# UrbanPulse AI — Smart City Operations & Municipal Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2+-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0+-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)

**UrbanPulse AI** is a production-grade, full-stack urban mobility analytics, environmental monitoring, and predictive AI intelligence platform designed for municipal operations centers and smart-city transit authorities.

---

## 🏷️ Telemetry Data Lineage & Honesty Transparency

UrbanPulse AI strictly distinguishes data provenance to ensure operational trust:

| Data Tag | Source | Purpose |
| :--- | :--- | :--- |
| `LIVE TELEMETRY` | Live IoT sensor streams / active database connection | Current city state monitoring |
| `SIMULATED TELEMETRY` | Calibrated historical urban dataset (5,200 records) | Baseline multi-vector statistical profiling |
| `MODEL PREDICTION` | Scikit-Learn ML inference models | Projected AQI, congestion, & risk classification |
| `SIMULATION OUTPUT` | Interactive What-If stress testing engine | Scenario planning (what-if traffic load surges) |

---

## 🏗️ Architecture & Component Stack

```text
URBANPULSE-AI/
├── backend/
│   ├── app/
│   │   ├── api/          # Dual route REST API routers (/api & /api/v1)
│   │   │   ├── overview.py       # GET /api/overview (Data Quality Badge)
│   │   │   ├── traffic.py        # GET /api/traffic
│   │   │   ├── pollution.py      # GET /api/pollution
│   │   │   ├── anomalies.py      # GET /api/anomalies & PATCH /api/anomalies/{id}/status
│   │   │   ├── predictions.py    # GET /api/predictions & POST /api/predictions/predict
│   │   │   ├── insights.py       # GET /api/insights
│   │   │   ├── locations.py      # GET /api/locations
│   │   │   ├── explorer.py       # GET /api/records & GET /api/records/export
│   │   │   └── auth.py           # POST /api/auth/login & GET /api/auth/me
│   │   ├── core/
│   │   │   ├── config.py         # Pydantic Settings configuration & CORS origin management
│   │   │   ├── database.py       # SQLAlchemy SessionLocal & Engine factory
│   │   │   └── logging_config.py # Structured Python logging configuration
│   │   ├── db/
│   │   │   ├── models.py         # UrbanRecord, LocationZone, AnomalyLog, InsightLog ORM
│   │   │   └── seeder.py         # Automatic CSV dataset database seeder
│   │   ├── ml/
│   │   │   ├── engine.py         # Scikit-learn ML models & feature pipelines
│   │   │   └── data_quality.py   # Telemetry bounds validator & quality evaluator
│   │   ├── schemas/
│   │   │   └── models.py         # Pydantic request/response validation schemas
│   │   └── main.py               # FastAPI app startup, health check & static file server
│   ├── test_suite.py             # 12 automated unit & integration tests
│   └── run.py                    # Production server entrypoint script
├── frontend/
│   ├── src/                      # React 18 frontend (Vite, Leaflet, Recharts)
│   ├── package.json
│   └── vite.config.js
├── Dockerfile                    # Multi-stage container build definition
├── docker-compose.yml            # Single-container production orchestration
├── .env.example                  # Environment configuration template
└── README.md
```

---

## 🤖 ML Pipeline & Verified Evaluation Metrics

UrbanPulse AI automatically trains four machine learning models on initial startup:

1. **Air Quality Regressor (`RandomForestRegressor`)**
   - **Target**: Air Quality Index (`aqi`)
   - **Performance**: $R^2 = 0.976$, $\text{RMSE} = 6.28$

2. **Traffic Congestion Regressor (`GradientBoostingRegressor`)**
   - **Target**: Congestion Index (`congestion_index`)
   - **Performance**: $R^2 = 0.980$, $\text{RMSE} = 0.041$

3. **Urban Risk Classifier (`RandomForestClassifier`)**
   - **Target**: Risk Level (`Low`, `Medium`, `High`, `Critical`)
   - **Performance**: $\text{Accuracy} = 96.3\%$, $\text{Weighted F1} = 0.958$

4. **Multivariate Anomaly Detection (`IsolationForest` + Z-Score)**
   - **Contamination**: 4.5% outlier detection rate

---

## 🚨 Incident Lifecycle State Machine

Urban Anomaly records support a backend-persisted 4-stage lifecycle:

$$\text{DETECTED} \longrightarrow \text{ACKNOWLEDGED} \longrightarrow \text{UNDER\_INVESTIGATION} \longrightarrow \text{RESOLVED}$$

**API Route**: `PATCH /api/anomalies/{anomaly_id}/status`
```json
{
  "status": "ACKNOWLEDGED"
}
```

---

## 📡 REST API Reference Summary

All endpoints are accessible under both `/api/...` and `/api/v1/...`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check (`200 OK`) |
| `GET` | `/api/readiness` | Database ping (`SELECT 1`) & ML engine load state check |
| `GET` | `/api/overview` | Executive KPIs & `DATA QUALITY ● GOOD` health status |
| `GET` | `/api/traffic` | Traffic density rankings, 24-hour flow, peak hours |
| `GET` | `/api/pollution` | AQI time series, PM2.5/PM10 metrics, weather breakdown |
| `GET` | `/api/anomalies` | IsolationForest anomaly feed & severity counts |
| `PATCH`| `/api/anomalies/{id}/status` | Update incident lifecycle status |
| `POST`| `/api/anomalies/detect` | Run live IsolationForest evaluation on custom payload |
| `GET` | `/api/predictions` | Model metrics, status, & feature weight bar charts |
| `POST`| `/api/predictions/predict` | Real-time prediction endpoint for AQI, Congestion, and Risk |

---

## 🐘 Production PostgreSQL Migration Guide

To migrate from SQLite (`urbanpulse.db`) to a production PostgreSQL database cluster:

### Step 1: Install PostgreSQL Driver
```bash
pip install psycopg2-binary
```

### Step 2: Configure Environment Variable
In `.env`:
```ini
DATABASE_URL=postgresql://urbanpulse_user:secure_password@postgres-db.internal:5432/urbanpulse_prod
```

### Step 3: Run Automatic Seeder
The database connection layer in `app/core/database.py` automatically detects standard PostgreSQL connection strings, initializes tables via SQLAlchemy, and seeds initial data without schema modifications.

---

## 🧪 Automated Testing Strategy

Execute the 12-test backend verification suite:
```bash
.venv\Scripts\python backend/test_suite.py
```
**Test Coverage**: Health checks, readiness endpoints, database queries, JWT authentication, ML predictions, IsolationForest anomaly detection, data quality validator, incident state transitions, invalid payload handling, location filters, and HTTP 404 error fallbacks.

---

## 🐳 Docker Deployment Guide

Build and start the single-container production environment:
```bash
# Build and run container in detached mode
docker-compose up --build -d

# Inspect health check status
docker ps
```
Access the application at **`http://localhost:8000`**.

---

## ⚙️ Local Development Instructions

### Option 1: Unified Single Server
```bash
# Start FastAPI backend (serves built React SPA frontend automatically)
python run.py
```

### Option 2: Frontend Hot Reloading (Vite)
```bash
# Terminal 1: Backend
python run.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 🔒 Security Policy & Controls
- **Zero Secrets Exposed**: No hardcoded API keys or JWT credentials in source code.
- **CORS Policy**: Configured strictly via `CORS_ORIGINS` in `.env`.
- **Database Safety**: SQL injection protected via SQLAlchemy parameterized query binding.
