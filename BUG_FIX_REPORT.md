# UrbanPulse AI — Bug Fix & Remediation Report

## 1. Summary of Bug Remediation

During the comprehensive audit and remediation process, **12 critical and functional bugs** were detected, isolated, and permanently resolved across backend services, ML inference modules, and frontend React views. All fixes were validated through automated test suites and production build checks.

---

## 2. Itemized Bug Remediation Log

### Bug #1: Scikit-Learn Feature Names Warning During Inference
- **Severity**: Medium (Runtime Warning / Log Pollution)
- **Affected File**: `backend/app/ml/engine.py`
- **Root Cause**: Models were trained on a `pandas.DataFrame` containing named feature columns (`temperature_c`, `humidity_pct`, `hour`, etc.), but `predict_aqi`, `predict_congestion`, and `predict_risk` were passing unlabeled 2D `numpy.ndarray` objects during inference, triggering:
  `UserWarning: X does not have valid feature names, but RandomForestRegressor was fitted with feature names`
- **Fix Applied**: Wrapped inference payloads in `pd.DataFrame([{...}], columns=feature_cols)` with exact column naming matching the training dataset.
- **Verification**: Executed `backend/test_suite.py`; zero warnings emitted during inference calls.
- **Status**: FIXED AND VERIFIED

---

### Bug #2: Unfitted Machine Learning Models During Headless Test Runs
- **Severity**: High (503 Service Unavailable / Runtime Exception)
- **Affected File**: `backend/app/ml/engine.py`
- **Root Cause**: When tests or worker scripts instantiated `app` via `TestClient(app)` without triggering the FastAPI lifespan context manager, the ML models remained uninitialized, throwing `NotFittedError: This IsolationForest instance is not fitted yet`.
- **Fix Applied**: Implemented `ensure_trained(self)` in `MLEngine` that checks `self.is_trained` and executes model fitting on demand using the SQLite dataset if models are unfitted.
- **Verification**: Tested via `backend/test_suite.py` and `tests/full_backend_test.py`; 100% test pass rate.
- **Status**: FIXED AND VERIFIED

---

### Bug #3: Hardcoded JWT Secret Key in Auth Router
- **Severity**: High (Security Vulnerability)
- **Affected File**: `backend/app/api/auth.py`
- **Root Cause**: The secret key was defined as a hardcoded static string literal:
  `SECRET_KEY = "urbanpulse_citizen_auth_secret_key_2026"`
- **Fix Applied**: Replaced with `SECRET_KEY = settings.JWT_SECRET`, deriving the secret dynamically from the centralized environment configuration.
- **Verification**: Verified JWT token creation and validation through `/api/auth/login` and `/api/auth/me` endpoints.
- **Status**: FIXED AND VERIFIED

---

### Bug #4: Duplicate OpenAPI Route Prefixes and Operation ID Collisions
- **Severity**: Medium (API Schema Specification Error)
- **Affected File**: `backend/app/main.py`
- **Root Cause**: Routers defining dual paths (`@router.get("/overview")` and `@router.get("/v1/overview")`) were included twice in `main.py`—once under `prefix="/api"` and once under `prefix="/api/v1"`, generating non-standard `/api/v1/v1/overview` paths and duplicate OpenAPI operation IDs.
- **Fix Applied**: Streamlined router mounting in `main.py` so each dual-path router is mounted once under `prefix="/api"`.
- **Verification**: Full 56-route audit passed without collision or 404 errors.
- **Status**: FIXED AND VERIFIED

---

### Bug #5: Missing Location Filtering in Traffic & Pollution Endpoints
- **Severity**: Medium (Data Filter Inconsistency)
- **Affected Files**: `backend/app/api/traffic.py`, `backend/app/api/pollution.py`
- **Root Cause**: The overview queries lacked a `location: Optional[str]` parameter and SQL filter, preventing the frontend from retrieving zone-specific metrics.
- **Fix Applied**: Added `location: Optional[str] = Query(None)` and conditional filtering against `UrbanRecord.location_name` and `UrbanRecord.location_id`.
- **Verification**: Tested zone queries for Patia, Saheed Nagar, and Jayadev Vihar; verified filtered responses.
- **Status**: FIXED AND VERIFIED

---

### Bug #6: Missing Methods in Frontend API Service
- **Severity**: High (Runtime TypeError in Analytics Page)
- **Affected File**: `frontend/src/services/api.js`
- **Root Cause**: `AnalyticsPage.jsx` called `api.getTrafficFlow()`, `api.getModes()`, and `api.getZones()`, but these methods were omitted from `api.js`, triggering `TypeError: api.getTrafficFlow is not a function`.
- **Fix Applied**: Added `getTrafficFlow()`, `getModes()`, `getZones()`, `getTrips(params)`, and `getTripDetail(recordId)` to `api.js`.
- **Verification**: Verified API client integration and compilation during production build.
- **Status**: FIXED AND VERIFIED

---

### Bug #7: Undefined Click Handlers in Traffic Intelligence View
- **Severity**: High (Unhandled ReferenceError on User Click)
- **Affected File**: `frontend/src/components/TrafficIntelligenceView.jsx`
- **Root Cause**: The UI rendered city preset pills and a location button calling `handleSelectCity(p)` and `handleDetectLocation()`, but neither function was declared in scope.
- **Fix Applied**: Implemented both handlers with geolocation permission checks, fallback coordinate defaults, and Leaflet map centering.
- **Verification**: Verified through synthetic event checks and build bundle compilation.
- **Status**: FIXED AND VERIFIED

---

### Bug #8: Static Disconnect in Live City Map Telemetry
- **Severity**: Medium (Data Visualization Inaccuracy)
- **Affected File**: `frontend/src/components/LiveCityMap.jsx`
- **Root Cause**: Map markers displayed hardcoded initial coordinates and mock risk scores instead of consuming the live `locations` array returned by `/api/locations`.
- **Fix Applied**: Added `useMemo` to merge live backend telemetry (AQI, speed, risk level, active alerts) into `displayZones`.
- **Verification**: Confirmed markers reflect actual database averages for all 8 Bhubaneswar sectors.
- **Status**: FIXED AND VERIFIED

---

### Bug #9: Silent Device Geolocation on Page Load
- **Severity**: High (Privacy & Compliance Violation)
- **Affected File**: `frontend/src/pages/WeatherIntelligence.jsx`
- **Root Cause**: `useEffect` automatically invoked `navigator.geolocation.getCurrentPosition(...)` upon first render without explicit user consent.
- **Fix Applied**: Removed silent geocoding on mount; set default view to Bhubaneswar; moved location detection to an explicit user-triggered button in the location search modal.
- **Verification**: Tested initial load in browser emulator; confirmed no geolocation permissions prompt appears until the button is clicked.
- **Status**: FIXED AND VERIFIED

---

### Bug #10: Route Mapping Mismatch for Data Explorer & AI Insights
- **Severity**: Medium (Navigation Inaccessibility)
- **Affected Files**: `frontend/src/App.jsx`, `frontend/src/context/UrbanPulseContext.jsx`
- **Root Cause**: The router switch in `App.jsx` rendered `AnalyticsWorkspace` for `'explorer'` and `AICopilotPage` for `'insights'`, making the dedicated `DataExplorerPage` and `InsightPage` components inaccessible.
- **Fix Applied**: Imported `DataExplorerPage` and `InsightPage`, mapped `'explorer'` and `'insights'` cases directly, and added `'explorer'` and `'insights'` to `knownTabs`.
- **Verification**: Verified tab state transitions and component rendering.
- **Status**: FIXED AND VERIFIED

---

### Bug #11: Missing Navigation Tabs in Header Menu
- **Severity**: Low (UX / User Journey Gap)
- **Affected File**: `frontend/src/components/Navbar.jsx`
- **Root Cause**: `publicNavItems` and `operatorNavItems` lacked items for Data Explorer (`explorer`), Analytics (`analytics`), and AI Insights (`insights`).
- **Fix Applied**: Added `Data Explorer`, `Analytics`, and `AI Insights` to desktop and mobile navigation menus with appropriate Lucide icons.
- **Verification**: Inspected navigation menu items and responsive mobile drawer.
- **Status**: FIXED AND VERIFIED

---

### Bug #12: Static Fallback Trends in Dashboard Charts
- **Severity**: Low (Visual Disconnect)
- **Affected File**: `frontend/src/components/dashboard/DynamicCharts.jsx`
- **Root Cause**: Charts always displayed calculated fallback arrays even when live `pollutionData.aqi_trends` and `trafficData.hourly_trends` were supplied by the backend.
- **Fix Applied**: Updated `aqiTrends` and `trafficTrends` to dynamically prioritize live backend response arrays when present.
- **Verification**: Verified that live telemetry trends render dynamically in the Command Center.
- **Status**: FIXED AND VERIFIED
