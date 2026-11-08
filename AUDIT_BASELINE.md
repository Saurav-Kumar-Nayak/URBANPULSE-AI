# URBANPULSE AI — AUDIT BASELINE REPORT
**Date**: 2026-09-13
**Audit Standard**: Master Production / Demo Readiness Audit & Zero-Regression Protocol

---

## 1. System Inventory & Architecture Baseline

### 1.1 Source Repository & Version Control
- **Git Branch**: `main`
- **Head Commit Hash**: `fe0fa8094456691a0c2af1804a96349da7d08c6a`
- **Commit Message**: `Update render.yaml specification to runtime: docker`
- **Working Tree State**: 12 modified tracked files, 2 untracked deployment configuration files.

### 1.2 Tech Stack Verification
- **Frontend Framework**: React (Vite 5), Tailwind CSS / Vanilla CSS dark system, Lucide React icons, Leaflet / React-Leaflet maps, Recharts.
- **Backend Framework**: FastAPI (Python 3.13), Uvicorn ASGI, SQLAlchemy ORM, Pydantic V2 schemas.
- **Database Layer**: SQLite (`backend/data/urbanpulse.db`), pre-seeded with 5,200 records across 8 smart city zones (Patia, Saheed Nagar, Jaydev Vihar, Master Canteen, Khandagiri, Rasulgarh, Old Town, Chandrasekharpur).
- **Machine Learning Engine**: Scikit-Learn (RandomForestRegressor for AQI & PM2.5, GradientBoostingRegressor for Traffic Congestion, RandomForestClassifier & IsolationForest for Anomaly/Risk Scoring).
- **Single-Server Platform**: `run.py` launches Uvicorn on port 8000, serving both FastAPI API routes (`/api/*`, `/api/v1/*`) and SPA static frontend files (`/assets`, fallback to `dist/index.html`).

---

## 2. Baseline Test Execution Results

| Test Category | Command / Verification | Status | Details |
| :--- | :--- | :--- | :--- |
| **Backend Test Suite** | `python backend/test_suite.py` | **PASS (12/12)** | Health, Readiness, Overview, Locations, Auth, Predictions, Anomaly Patching, Anomalies Filter verified in 5.34s. |
| **Frontend Production Build** | `npm run build` (in `/frontend`) | **PASS** | Vite production bundle compiled in 21.05s. |
| **Dataset Integrity** | `backend/data/urbanpulse.db` | **PASS** | 5,200 real urban telemetry records loaded with non-null AQI, PM2.5, PM10, traffic density, speed, risk score. |
| **ML Model Engine** | `ml_engine.train_models()` | **PASS** | Trained on 5,200 records. R² (AQI)=0.976, R² (Traffic)=0.980, Risk Acc=0.963. |

---

## 3. Discovered Routes & Endpoints Inventory

### 3.1 Frontend Routes (from `frontend/src/App.jsx`)
1. `/` — Landing Page (`LandingPage.jsx`)
2. `/command-center` / `/dashboard` — Operations Command Center (`CommandCenter.jsx`)
3. `/live-city` — 3D Digital Twin & Live Map (`LiveCity.jsx`)
4. `/predictions` / `/predictive-studio` — Predictive Studio (`Predictions.jsx` / `PredictionPage.jsx`)
5. `/traffic` / `/traffic-intelligence` — Traffic Intelligence (`TrafficIntelligence.jsx` / `TrafficPage.jsx`)
6. `/pollution` / `/environmental-intelligence` — Environmental Intelligence (`EnvironmentalIntelligence.jsx` / `PollutionPage.jsx`)
7. `/anomalies` / `/risk-anomalies` — Risk & Anomalies (`RiskAnomalies.jsx` / `AnomalyPage.jsx`)
8. `/analytics` / `/analytics-workspace` — Analytics Workspace (`AnalyticsWorkspace.jsx` / `AnalyticsPage.jsx`)
9. `/ml-models` — ML Model Center (`MLModelCenter.jsx`)
10. `/copilot` — AI Copilot (`AICopilotPage.jsx`)
11. `/weather` — Weather & Radar Intelligence (`WeatherIntelligence.jsx`)
12. `/simulator` — What-If Simulator (`WhatIfSimulator.jsx`)
13. `/explorer` — Data Explorer (`DataExplorerPage.jsx`)
14. `/insights` — Insight Engine (`InsightPage.jsx`)
15. `/settings` — Settings (`SettingsPage.jsx`)
16. `/api-docs` — API Docs (`ApiDocsPage.jsx`)
17. `/login` / `/signup` / `/forgot-password` — Auth Flow Pages

### 3.2 Backend API Endpoints (from `backend/app/main.py`)
- `GET /health` & `GET /api/health` & `GET /api/v1/health`
- `GET /readiness` & `GET /api/readiness` & `GET /api/v1/readiness`
- `GET /api/overview` — Operational KPIs, active anomalies, risk scores
- `GET /api/traffic` — Zone traffic density, congestion index, speed
- `GET /api/pollution` — Zone AQI, PM2.5, PM10, CO2, temperature, humidity
- `GET /api/anomalies` — Filtered list of detected anomalies & risk incidents
- `PATCH /api/anomalies/{id}/status` — Incident lifecycle status update (DETECTED, ACKNOWLEDGED, UNDER_INVESTIGATION, RESOLVED)
- `GET /api/predictions` — Model performance metrics, feature importance, forecast horizon
- `POST /api/predictions/predict` — ML real-time inference endpoint
- `GET /api/insights` — Dynamic rule-based & ML city insights
- `GET /api/locations` — All 8 city zone coordinates & current telemetry snapshot
- `GET /api/explorer` — Pagination & filtering over 5,200 database records
- `GET /api/analytics` — Historical time-series analytics aggregations
- `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/google` — Auth routes

---

## 4. Initial Audit Observations & Findings

1. **Backend & ML Pipeline**: Outstanding performance and zero crash startup. Model inference is real and fully backed by Scikit-learn.
2. **Frontend Routing & Serving**: All 17 pages are integrated cleanly into React Router. Build compiles cleanly.
3. **Incident Lifecycle Persistence**: Backend API supports anomaly status patching (`PATCH /api/anomalies/{id}/status`).
4. **Data Lineage Framing**: AI responses and KPI cards explicitly indicate whether data source is `LIVE TELEMETRY` or `MODEL PREDICTION`.

---
*Report generated as part of Zero-Regression Audit Baseline.*
