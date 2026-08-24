import React, { useState } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const LocationPanel = ({ onLocationDetected, activeZone = "Patia" }) => {
  const [locState, setLocState] = useState({
    city: "Bhubaneswar, Odisha",
    area: "Patia, Bhubaneswar",
    country: "Odisha, India",
    lat: 20.2961,
    lng: 85.8245,
    isRealDevice: false,
    status: "Monitored Zone Active"
  });
  const [detecting, setDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(4));
        const longitude = Number(position.coords.longitude.toFixed(4));
        
        const updated = {
          city: `Lat ${latitude}°, Lng ${longitude}°`,
          area: "User Monitored Zone",
          country: "Detected Geolocation",
          lat: latitude,
          lng: longitude,
          isRealDevice: true,
          status: "Real Geolocation Synced"
        };

        setLocState(updated);
        setDetecting(false);

        if (onLocationDetected) {
          onLocationDetected(updated);
        }
      },
      (err) => {
        setDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location permission denied. Showing default zone.");
        } else {
          setErrorMsg("Could not fetch current coordinates.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
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
            Current Location
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, color: '#34d399' }}>
          <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
          <span>LIVE</span>
        </div>
      </div>

      {/* Main Location Name */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {locState.city}
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          {locState.area} • {locState.country}
        </p>
        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>
          {locState.lat}° N, {locState.lng}° E
        </div>
      </div>

      {/* Error state if permission denied */}
      {errorMsg && (
        <div style={{ fontSize: '0.70rem', color: '#fb7185', background: 'rgba(244,63,94,0.1)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={12} />
          <span>{errorMsg}</span>
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
          boxShadow: '0 0 12px rgba(6,182,212,0.15)'
        }}
        id="btn-detect-location"
      >
        {detecting ? (
          <>
            <RefreshCw size={13} className="spin" />
            <span>Detecting Satellite Signal...</span>
          </>
        ) : (
          <>
            <Navigation size={13} color="#06b6d4" />
            <span>{locState.isRealDevice ? "Re-sync Location" : "Detect My Location"}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default LocationPanel;
