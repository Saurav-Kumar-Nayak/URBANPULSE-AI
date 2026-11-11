# UrbanPulse AI — Technical Interview Demo & Architecture Defense Guide

## 1. Quick Launch for Interview Demo
1. **Double-click `start.bat`** in the project folder (or double-click the **`UrbanPulse AI`** icon on your Desktop).
2. The server initializes in 3 seconds (seeds SQLite and fits Scikit-learn models), and automatically opens:
   - **`http://localhost:8000`** in your default browser.
3. Open **`http://localhost:8000/docs`** in a second tab to show your OpenAPI Swagger documentation.

---

## 2. 5-Minute High-Impact Demo Walkthrough

### Step 1: Command Center (`/command-center`)
- **What to say**:
  > *"UrbanPulse AI is an enterprise-grade smart city intelligence platform that unifies urban mobility, air quality telemetry, and predictive machine learning. We model 8 strategic corridors in Bhubaneswar, Odisha across 5,200 continuous hourly records."*
- **Action**: Click on any zone (e.g. *Patia* or *Saheed Nagar*) on the interactive map. Point out that the KPIs, prediction timelines, traffic rankings, and charts dynamically update to that corridor's telemetry.

### Step 2: Predictive Studio (`/predictions`)
- **What to say**:
  > *"Instead of generic heuristic rules, we train 3 distinct Scikit-learn models in real time: a Random Forest Regressor for AQI (R²=0.976), a Gradient Boosting Regressor for traffic congestion (R²=0.980), and a Random Forest Classifier for 4-tier urban risk classification (96.3% accuracy)."*
- **Action**: Select a preset scenario (*Morning Rush* or *Heavy Traffic*), tweak the traffic density or PM2.5 sliders, and click **"Run Prediction"**. Show the actual vs. AI predicted curves and feature importance charts.

### Step 3: Risk & Isolation Forest Anomalies (`/risk`)
- **What to say**:
  > *"To detect unpredictable city events like unexpected gridlocks or localized pollution spikes, we run an Isolation Forest anomaly detector with a 4.5% contamination factor. Operators can acknowledge and resolve incidents live via our REST API."*
- **Action**: Click **"Acknowledge"** on an active anomaly incident to demonstrate real-time database state persistence.

### Step 4: AI Copilot (`/ai-copilot`)
- **What to say**:
  > *"UrbanPulse AI features a grounded AI Copilot powered by a custom FastAPI endpoint. It evaluates operator natural language queries against real database records and ML pipelines, providing grounded answers, confidence scores, and operator recommendations."*
- **Action**: Click one of the suggested prompts (e.g. *"Which zone has the highest predicted congestion?"*) or type your own prompt.

### Step 5: Data Quality & Analytics (`/analytics` & `/explorer`)
- **What to say**:
  > *"In real-world data engineering, data quality is paramount. Our Analytics Workspace runs an automated Data Quality Assessor that checks schema compliance, null rates, and sensor drift. Operators can also export filtered datasets to CSV directly from our Data Explorer."*
- **Action**: Click **"Export Dataset (CSV)"** in Data Explorer to show streaming CSV generation.

---

## 3. Anticipated Interviewer Questions & Model Answers

### Q1: "Are these ML models real or hardcoded mockups?"
- **Answer**:
  > *"They are real Scikit-learn models implemented in `backend/app/ml/engine.py`. During FastAPI startup (`startup_event`), the engine loads the 5,200 records from SQLite and performs an 80/20 train/test split. The reported R² and accuracy scores are calculated dynamically from `sklearn.metrics.r2_score` and `accuracy_score` on holdout data. Predictions execute real `.predict()` calls."*

### Q2: "How is the project deployed in production?"
- **Answer**:
  > *"We have a multi-stage `Dockerfile` with Node 20 building the React/Vite SPA and Python 3.11 serving the runtime. In single-server mode, FastAPI mounts the compiled `dist/` directory and serves it alongside the `/api` endpoints, eliminating CORS issues in production. It is live and tested on Render."*

### Q3: "How do you handle data quality and sensor outliers?"
- **Answer**:
  > *"We have two layers: First, an automated `DataQualityValidator` that checks completeness and value ranges. Second, an `IsolationForest` model that looks across the multivariate space (traffic density, congestion index, AQI, PM2.5, and risk score) to identify anomalies that don't fit standard distributions."*

### Q4: "How is authentication handled?"
- **Answer**:
  > *"We use OAuth2 Bearer tokens with HMAC-SHA256 JWTs (`python-jose`) and Passlib BCrypt password hashing. We enforce role-based access control (Citizen vs. Municipal Operator)."*
