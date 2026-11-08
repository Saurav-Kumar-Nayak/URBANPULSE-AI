# UrbanPulse AI — Bug Register & Remediation Audit

## 1. Bug Registry Summary

| ID | Module / Component | Severity | Discovered Symptom | Status | Verification Method |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **BUG-01** | `backend/app/ml/engine.py` | Medium | Scikit-Learn `UserWarning: X does not have valid feature names` | **FIXED AND VERIFIED** | `backend/test_suite.py` unit test passes without warnings. |
| **BUG-02** | `backend/app/ml/engine.py` | High | `NotFittedError` during headless test runs without lifespan | **FIXED AND VERIFIED** | Implemented `ensure_trained()`; verified in automated test suite. |
| **BUG-03** | `backend/app/api/auth.py` | High | Hardcoded JWT secret literal in source code | **FIXED AND VERIFIED** | Tied strictly to `settings.JWT_SECRET` loaded from `.env`. |
| **BUG-04** | `backend/app/main.py` | Medium | Duplicate route prefixes `/api/v1/v1/...` and operation ID collisions | **FIXED AND VERIFIED** | Streamlined router inclusions in `main.py`; 56/56 endpoints audited. |
| **BUG-05** | `backend/app/api/traffic.py` | Medium | Missing `location` parameter in traffic & pollution queries | **FIXED AND VERIFIED** | Added `Query(None)` and conditional filtering against `UrbanRecord`. |
| **BUG-06** | `frontend/src/services/api.js`| High | `TypeError: api.getTrafficFlow is not a function` in analytics view | **FIXED AND VERIFIED** | Implemented `getTrafficFlow()`, `getModes()`, `getZones()`, `getTrips()`. |
| **BUG-07** | `TrafficIntelligenceView.jsx` | High | `ReferenceError` on city preset and detect location button clicks | **FIXED AND VERIFIED** | Declared missing handler functions with Leaflet view recentering. |
| **BUG-08** | `frontend/src/components/LiveCityMap.jsx` | Medium | Map markers failed to reflect live `/api/locations` telemetry | **FIXED AND VERIFIED** | Merged live telemetry into `displayZones` using `useMemo`. |
| **BUG-09** | `WeatherIntelligence.jsx` | High | Silent background geolocation query on component mount | **FIXED AND VERIFIED** | Removed auto-geolocation; defaulted to Bhubaneswar; added explicit button. |
| **BUG-10** | `frontend/src/App.jsx` | Medium | Route mapping sent `'explorer'` and `'insights'` to duplicate pages | **FIXED AND VERIFIED** | Mapped `'explorer'` -> `DataExplorerPage`, `'insights'` -> `InsightPage`. |
| **BUG-11** | `frontend/src/components/Navbar.jsx` | Low | Navigation bar lacked buttons for Explorer, Analytics, and Insights | **FIXED AND VERIFIED** | Added menu items to public and operator desktop/mobile navigation. |
| **BUG-12** | `DynamicCharts.jsx` | Low | Charts used hardcoded fallback trends instead of backend trends | **FIXED AND VERIFIED** | Dynamically prioritized `pollutionData.aqi_trends` and `hourly_trends`. |
| **BUG-13** | `backend/app/api/analytics.py`| Low | DeprecationWarning on `datetime.utcnow()` | **FIXED AND VERIFIED** | Updated to Python 3.13 standard `datetime.now(timezone.utc)`. |

---

## 2. Root Cause & Diff Analysis

### BUG-01: Scikit-Learn Feature Column Alignment
- **Root Cause**: Models trained on a pandas DataFrame expected named column features during inference. Passing NumPy 2D arrays triggered continuous warnings.
- **Resolution**:
  ```python
  # Before:
  pred = self.aqi_model.predict(np.array([[temp, hum, density, hour, month, dow]]))
  # After:
  feature_df = pd.DataFrame([{
      "temperature_c": temp, "humidity_pct": hum, "traffic_density": density,
      "hour": hour, "month": month, "day_of_week": dow
  }], columns=self.aqi_features)
  pred = self.aqi_model.predict(feature_df)
  ```

### BUG-02: Headless Model Initialization
- **Root Cause**: `TestClient(app)` instantiates FastAPI without firing `startup` lifespan events. Consequently, `ml_engine.is_trained` remained `False`.
- **Resolution**:
  ```python
  def ensure_trained(self):
      if not self.is_trained:
          db = SessionLocal()
          try:
              records = db.query(UrbanRecord).all()
              self.train_all(records)
          finally:
              db.close()
  ```

### BUG-09: User Privacy Geolocation Enforcement
- **Root Cause**: An unprompted `navigator.geolocation.getCurrentPosition(...)` call inside `useEffect([], ...)` violated strict municipal privacy standards.
- **Resolution**:
  ```javascript
  // Removed automatic execution on mount:
  useEffect(() => {
    loadWeatherData(userLocation);
    loadRadarData();
  }, []);

  // Added explicit user-triggered button in location modal:
  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  };
  ```
