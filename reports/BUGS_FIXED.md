# UrbanPulse AI — Bugs Fixed & Codebase Repairs Log

This register documents all issues, defects, and friction points discovered and repaired during the audit.

---

### Bug #1: Missing Dedicated Backend AI Copilot Endpoint
- **Severity**: High
- **Issue**: Frontend AI Copilot previously synthesized queries primarily on the client, lacking a dedicated backend endpoint with database aggregation and direct ML inference.
- **Fix Implemented**:
  - Implemented `backend/app/api/copilot.py` with `POST /api/copilot/query` and `GET /api/copilot/context`.
  - Connected query analyzer to live `UrbanRecord`, `LocationZone`, and `ml_engine` pipelines.
  - Added request/response Pydantic models (`CopilotQueryRequest`, `CopilotQueryResponse`).
  - Registered route in `backend/app/main.py` under both `/api` and `/api/v1`.
  - Updated `frontend/src/services/api.js` and `frontend/src/services/aiService.js`.
- **Status**: **RESOLVED & VERIFIED**.

---

### Bug #2: Hardcoded Risk Curve Identity in Hourly Prediction Metadata
- **Severity**: Medium
- **Issue**: In `backend/app/api/predictions.py` line 59, `pred_rk = act_rk` was assigned directly, omitting ML-driven risk forecasting for hourly curves.
- **Fix Implemented**:
  - Connected `ml_engine.predict_risk(input_data)` to generate class probabilities.
  - Weighted probabilities against continuous risk scoring scale (`Low: 20`, `Medium: 45`, `High: 70`, `Critical: 90`).
  - Outputted a smooth, ML-grounded predicted risk curve.
- **Status**: **RESOLVED & VERIFIED**.

---

### Bug #3: Trips Endpoint Trailing Slash 307 Redirect Risk
- **Severity**: Low / Performance
- **Issue**: `backend/app/api/trips.py` was mounted with `@router.get("/")`, causing non-trailing slash calls (`/api/trips`) to issue HTTP 307 redirects.
- **Fix Implemented**:
  - Added dual decorators `@router.get("")` and `@router.get("/")` to support direct responses without redirects.
- **Status**: **RESOLVED & VERIFIED**.

---

### Bug #4: Cartoonish 3D Push-Button CSS Shadows
- **Severity**: Low / Visual Polish
- **Issue**: `.btn-primary` and `.btn-3d` in `index.css` had heavy push-button borders (`0 4px 0 #1d4ed8`) and extreme drop shadows, giving a cartoon/demo appearance.
- **Fix Implemented**:
  - Refactored `.btn-primary` and `.btn-subtle` to modern, crisp enterprise dark mode aesthetics (subtle 1px borders, restrained shadows, solid Palantir/Datadog-style styling).
- **Status**: **RESOLVED & VERIFIED**.

---

### Bug #5: One-Click Browser Launch Integration
- **Severity**: Feature / Operational
- **Issue**: Starting the server required manual multi-step terminal commands, and localhost wasn't automatically opened.
- **Fix Implemented**:
  - Added background thread in `run.py` to poll `/api/health` and automatically trigger `webbrowser.open("http://localhost:8000")` upon server readiness.
  - Created root `start.bat` and Desktop shortcut for 1-click execution.
- **Status**: **RESOLVED & VERIFIED**.
