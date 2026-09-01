import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';

export const LocationPanel = ({ onLocationDetected, activeZone = "LOC-01", zones = [] }) => {
  const [locState, setLocState] = useState({
    city: "Bhubaneswar Metropolitan Zone",
    area: "Patia Main Road",
    country: "Odisha Telemetry Grid",
    lat: 20.3547,
    lng: 85.8153,
    isRealDevice: false,
    status: "Monitored Zone Focus"
  });
  const [detecting, setDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualSelection, setManualSelection] = useState(activeZone);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
      if (!res.ok) throw new Error("Reverse geocode request failed");
      const data = await res.json();
      
      const city = data.address?.city || data.address?.town || data.address?.county || "Current Metro Area";
      const state = data.address?.state || "";
      const country = data.address?.country || "Detected Region";
      const area = data.address?.suburb || data.address?.neighbourhood || data.address?.road || `${city} Area`;

      return {
        city: state ? `${city}, ${state}` : city,
        area: area,
        country: country
      };
    } catch {
      return {
        city: `Area (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
        area: "Current Coordinates",
        country: "Local System"
      };
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Location access is unavailable.");
      return;
    }

    setDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = Number(position.coords.latitude.toFixed(4));
        const longitude = Number(position.coords.longitude.toFixed(4));
        
        const geoInfo = await reverseGeocode(latitude, longitude);

        const updated = {
          city: geoInfo.city,
          area: geoInfo.area,
          country: geoInfo.country,
          lat: latitude,
          lng: longitude,
          isRealDevice: true,
          status: "Live Device Location Synced"
        };

        setLocState(updated);
        setDetecting(false);

        if (onLocationDetected) {
          onLocationDetected(updated);
        }
      },
      (err) => {
        setDetecting(false);
        setErrorMsg("Location access is unavailable.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualZoneSelect = (e) => {
    const zoneId = e.target.value;
    setManualSelection(zoneId);
    const selectedObj = zones.find(z => z.location_id === zoneId);
    if (selectedObj) {
      const updated = {
        city: selectedObj.location_name,
        area: selectedObj.area_type,
        country: "Monitored City Zone",
        lat: selectedObj.latitude,
        lng: selectedObj.longitude,
        isRealDevice: false,
        status: "Manual Zone Active"
      };
      setLocState(updated);
      if (onLocationDetected) {
        onLocationDetected(updated);
      }
    }
  };

  return (
    <div 
      className="card-panel" 
      style={{ 
        padding: '16px 18px', 
        background: 'linear-gradient(135deg, rgba(13, 19, 28, 0.95), rgba(17, 25, 35, 0.98))',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Header Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={15} color="#06b6d4" />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Location Context
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: locState.isRealDevice ? 'rgba(16,185,129,0.12)' : 'rgba(56,189,248,0.12)', border: locState.isRealDevice ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(56,189,248,0.3)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, color: locState.isRealDevice ? '#34d399' : '#38bdf8' }}>
          <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
          <span>{locState.isRealDevice ? "GEOLOCATION ACTIVE" : "ZONE FOCUSED"}</span>
        </div>
      </div>

      {/* Main Location Info */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {locState.city}
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          {locState.area} • {locState.country}
        </p>
        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>
          {locState.lat.toFixed(4)}° N, {locState.lng.toFixed(4)}° E
        </div>
      </div>

      {/* Fallback & Error Handling */}
      {errorMsg && (
        <div style={{ fontSize: '0.72rem', color: '#fb7185', background: 'rgba(244,63,94,0.1)', padding: '8px 10px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(244,63,94,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={13} />
            <strong style={{ fontWeight: 700 }}>{errorMsg}</strong>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Select a operational city zone manually below:</span>
        </div>
      )}

      {/* Manual City / Zone Selector */}
      {zones && zones.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Manual Zone Focus:</label>
          <div style={{ position: 'relative' }}>
            <select
              value={manualSelection}
              onChange={handleManualZoneSelect}
              style={{
                width: '100%',
                padding: '6px 28px 6px 10px',
                fontSize: '0.75rem',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              {zones.map(z => (
                <option key={z.location_id} value={z.location_id}>
                  {z.location_name} ({z.area_type})
                </option>
              ))}
            </select>
            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      )}

      {/* Detect Button */}
      <button
        onClick={handleDetectLocation}
        disabled={detecting}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '8px 12px',
          fontSize: '0.78rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(59, 130, 246, 0.25))',
          border: '1px solid rgba(6, 182, 212, 0.5)',
          color: '#38bdf8',
          boxShadow: '0 0 12px rgba(6,182,212,0.15)',
          cursor: 'pointer'
        }}
        id="btn-detect-location"
      >
        {detecting ? (
          <>
            <RefreshCw size={13} className="spin" />
            <span>Resolving Geolocation...</span>
          </>
        ) : (
          <>
            <Navigation size={13} color="#06b6d4" />
            <span>{locState.isRealDevice ? "Re-detect Location" : "Detect My Location"}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default LocationPanel;
