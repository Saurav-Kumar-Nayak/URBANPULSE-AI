import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ChevronRight, 
  Car, 
  Wind, 
  Sun, 
  ShieldCheck, 
  Activity,
  RefreshCw
} from 'lucide-react';
import LocationPanel from './LocationPanel';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const LeftIntelligencePanel = ({ overview = null, activeZone = null, onLocationDetected }) => {
  const { setActiveTab } = useUrbanPulseContext();

  const [locState, setLocState] = useState({
    city: "Bhubaneswar Metropolitan Zone",
    area: "Patia Main Road",
    country: "Odisha Telemetry Grid",
    lat: "20.3547",
    lng: "85.8153",
    health: 84,
    speed: 28,
    aqi: 72,
    risk: "Low Risk",
    temp: "32°C",
    isDetected: false
  });

  // Sync state whenever activeZone prop changes (e.g. when map location is clicked)
  useEffect(() => {
    if (activeZone) {
      setLocState(prev => ({
        ...prev,
        city: activeZone.name ? `${activeZone.name} Area` : prev.city,
        area: activeZone.name || prev.area,
        lat: activeZone.lat ? activeZone.lat.toFixed(4) : prev.lat,
        lng: activeZone.lng ? activeZone.lng.toFixed(4) : prev.lng,
        health: activeZone.health || prev.health,
        speed: activeZone.speed || prev.speed,
        aqi: activeZone.aqi || prev.aqi,
        risk: activeZone.risk || prev.risk,
        temp: activeZone.temp || prev.temp
      }));
    }
  }, [activeZone]);

  // Calculate SVG arc offset for Urban Health Score gauge
  const healthPercent = Math.min(100, Math.max(0, locState.health));
  const dashOffset = 188 - (188 * healthPercent) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* 1. CURRENT LOCATION PANEL WITH GEOLOCATION & FALLBACK */}
      <LocationPanel 
        onLocationDetected={(loc) => {
          setLocState(prev => ({
            ...prev,
            city: loc.city,
            area: loc.area,
            country: loc.country,
            lat: loc.lat.toFixed(4),
            lng: loc.lng.toFixed(4),
            isDetected: loc.isRealDevice
          }));
          if (onLocationDetected) onLocationDetected(loc);
        }}
        activeZone={typeof activeZone === 'string' ? activeZone : (activeZone?.id || "LOC-01")}
        zones={overview?.locations || []}
      />

      {/* 2. URBAN HEALTH SCORE CARD */}
      <div 
        className="card-panel"
        style={{
          padding: '16px',
          background: 'rgba(13, 19, 28, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
            <Activity size={15} color="#34d399" />
            <span>Urban Health Score</span>
          </div>
          <ChevronRight size={14} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('analytics')} />
        </div>

        {/* Semi-Circle Arc Gauge SVG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0 0 0', position: 'relative' }}>
          <svg width="150" height="85" viewBox="0 0 150 85">
            <path
              d="M 15,75 A 60,60 0 0,1 135,75"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 15,75 A 60,60 0 0,1 135,75"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="188"
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', bottom: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
              {locState.health} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>/100</span>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: locState.health >= 80 ? '#34d399' : locState.health >= 70 ? '#fbbf24' : '#fb7185', marginTop: '2px' }}>
              {locState.health >= 80 ? 'Optimal' : locState.health >= 70 ? 'Moderate' : 'Critical'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.70rem', color: '#34d399', fontWeight: 600 }}>
          ↑ 6% vs yesterday
        </div>
      </div>

      {/* 3. TRAFFIC STATUS */}
      <div 
        className="card-panel"
        style={{
          padding: '14px 16px',
          background: 'rgba(13, 19, 28, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
            <Car size={15} color="#38bdf8" />
            <span>Traffic Status</span>
          </div>
          <ChevronRight size={14} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('traffic')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: locState.speed >= 28 ? '#34d399' : locState.speed >= 20 ? '#fbbf24' : '#fb7185' }}>
              {locState.speed >= 28 ? 'Smooth' : locState.speed >= 20 ? 'Moderate' : 'Heavy'}
            </div>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8', marginTop: '2px' }}>
              Average Speed
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', marginTop: '1px' }}>
              {locState.speed} km/h <span style={{ color: '#34d399', fontSize: '0.70rem' }}>↑ 5%</span>
            </div>
          </div>

          {/* Dynamic Sparkline curve */}
          <svg width="64" height="32" viewBox="0 0 64 32" style={{ overflow: 'visible' }}>
            <path
              d={locState.speed >= 25 ? "M 0,22 Q 16,5 32,18 T 64,8" : "M 0,10 Q 16,25 32,8 T 64,22"}
              fill="none"
              stroke={locState.speed >= 25 ? "#34d399" : "#fb7185"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 4. AIR QUALITY INDEX */}
      <div 
        className="card-panel"
        style={{
          padding: '14px 16px',
          background: 'rgba(13, 19, 28, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
            <Wind size={15} color="#34d399" />
            <span>Air Quality Index</span>
          </div>
          <ChevronRight size={14} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('pollution')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: locState.aqi < 75 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: locState.aqi < 75 ? '#34d399' : '#fbbf24' }}>
            <Wind size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{locState.aqi}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: locState.aqi < 75 ? '#34d399' : locState.aqi < 100 ? '#fbbf24' : '#fb7185' }}>
                {locState.aqi < 75 ? 'Good' : locState.aqi < 100 ? 'Moderate' : 'Unhealthy'}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
              PM2.5 ({(locState.aqi * 0.34).toFixed(1)} µg/m³) <span style={{ color: '#fbbf24' }}>↑ 3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. WEATHER */}
      <div 
        className="card-panel"
        style={{
          padding: '14px 16px',
          background: 'rgba(13, 19, 28, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
            <Sun size={15} color="#fbbf24" />
            <span>Weather</span>
          </div>
          <ChevronRight size={14} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('weather')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Sun size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{locState.temp}</span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Feels like 36°C</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
              Partly Cloudy <span style={{ color: '#34d399' }}>↑ 1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. RISK LEVEL */}
      <div 
        className="card-panel"
        style={{
          padding: '14px 16px',
          background: 'rgba(13, 19, 28, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
            <ShieldCheck size={15} color="#34d399" />
            <span>Risk Level</span>
          </div>
          <ChevronRight size={14} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('risk')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: locState.risk.includes('High') ? '#fb7185' : '#34d399' }}>
              {locState.risk}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
              No Major Alerts <span style={{ color: '#34d399' }}>↓ 10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. VIEW ALL INTELLIGENCE BUTTON */}
      <button
        onClick={() => setActiveTab('analytics')}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(29, 78, 216, 0.4))',
          border: '1px solid rgba(59, 130, 246, 0.5)',
          color: '#ffffff',
          fontSize: '0.80rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
        }}
      >
        <span>View All Intelligence</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default LeftIntelligencePanel;
