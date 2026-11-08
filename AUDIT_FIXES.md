# URBANPULSE AI — AUDIT FIXES LOG

**Audit Execution Date**: 2026-09-13  
**Scope**: Minimal, targeted, zero-regression defect resolutions across frontend services, backend schema definitions, DB models, and API endpoints.

---

## Confirmed & Resolved Defect Log

| Defect ID | Severity | Affected File | Root Cause | Fix Applied | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FIX-001** | **Medium** | `backend/app/db/models.py`<br>`backend/app/schemas/models.py`<br>`backend/app/api/anomalies.py` | Anomaly lifecycle status was not persisted in database or returned in API schema when operator clicked "Acknowledge" in UI. | Added `status` column to `UrbanRecord` model, updated `AnomalyItemSchema`, and added full `PATCH /api/anomalies/{id}/status` handler with DB commit. | Verified via `test_suite.py` test #7 & #10 and browser subagent interaction. |
| **FIX-002** | **Medium** | `frontend/src/services/api.js` | Anomaly status update frontend service wrapper was missing, preventing UI status persistence calls to backend. | Added `updateAnomalyStatus: async (anomalyId, status) => apiClient.patch(...)` service method. | Verified via frontend build and live API network request. |
| **FIX-003** | **Low** | `frontend/src/components/dashboard/ActiveAlertCenter.jsx`<br>`frontend/src/pages/RiskAnomalies.jsx` | UI alert buttons were not triggering persistent API status updates. | Integrated `api.updateAnomalyStatus()` on acknowledge button click, updating local state and sending PATCH to backend. | Verified via subagent alert acknowledge click and backend DB query. |
| **FIX-004** | **Low** | `backend/app/core/config.py` | Hardcoded local CORS origins prevented flexible Vercel / Render cross-origin deployment. | Implemented dynamic `_get_cors_origins()` reading `FRONTEND_URL` and JSON/comma-separated `CORS_ORIGINS` environment variables. | Verified backend CORS pre-flight responses. |
| **FIX-005** | **Low** | `frontend/src/services/aiService.js`<br>`frontend/src/components/dashboard/LeftIntelligencePanel.jsx`<br>`frontend/src/components/PredictiveStudio.jsx` | AI Copilot answers and Predictive Studio cards lacked explicit data lineage badges to distinguish live telemetry from ML model inference. | Added explicit `[LIVE TELEMETRY & MODEL PREDICTION]` headers and `MODEL PREDICTION` / `LIVE TELEMETRY` badges. | Verified visual rendering across pages. |
| **FIX-006** | **Low** | `frontend/src/components/PredictiveStudio.jsx` | Predict button used standard flat gradient styling instead of project-wide 3D tactile design standard. | Updated button class to `btn-primary` with tactile 3D hover-lift, active-press shadow curves, and crisp typography. | Verified visually in browser audit. |

---

## Safety Protocol Adherence Checklist
- [x] NO architectural redesigns performed.
- [x] NO existing framework, library, or routing logic replaced.
- [x] NO working features, pages, or API endpoints deleted.
- [x] NO mock data substituted for real ML model outputs or database queries.
- [x] ALL database modifications are purely non-destructive schema extensions (`status` column addition).
