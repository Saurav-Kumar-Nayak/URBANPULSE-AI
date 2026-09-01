import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import LiveCityMap from '../components/LiveCityMap';
import { api } from '../services/api';
import { AlertTriangle, MapPin, Activity, Flame, ShieldAlert, Cpu, Radio, ChevronRight } from 'lucide-react';

export const LiveCity = () => {
  const [locations, setLocations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [hoveredZone, setHoveredZone] = useState(null);

  useEffect(() => {
    api.getLocations().then((res) => setLocations(res || [])).catch(() => {});
    api.getAnomalies().then((res) => setAnomalies(res?.recent_anomalies || [])).catch(() => {});
  }, []);

  const filteredAnomalies = filterSeverity === 'ALL'
    ? anomalies
    : anomalies.filter((a) => a.severity === filterSeverity);

  return (
    <PageContainer>
      {/* 3D Header Section */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, #0B1730 0%, #071226 100%)',
        border: '1px solid rgba(120, 170, 255, 0.22)',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '20px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(32, 217, 255, 0.2) 0%, rgba(30, 167, 255, 0.05) 100%)',
            border: '1px solid rgba(32, 217, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 16px rgba(32, 217, 255, 0.25)'
          }}>
            <Activity size={22} color="#20D9FF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(39, 209, 127, 0.15)',
                border: '1px solid rgba(39, 209, 127, 0.35)',
                color: '#27D17F',
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.06em'
              }}>
                ● REAL-TIME SYNC
              </span>
              <span style={{ fontSize: '0.74rem', color: '#91A4C5', fontWeight: 600 }}>
                MUNICIPAL DIGITAL TWIN
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F5F8FF', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>
              Live City Telemetry
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: '#101E3A',
            border: '1px solid rgba(120, 170, 255, 0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#20D9FF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Radio size={14} color="#20D9FF" />
            <span>{locations.length || 8} Zones Tracked</span>
          </div>
          <div style={{
            background: '#101E3A',
            border: '1px solid rgba(120, 170, 255, 0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#7C5CFF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Cpu size={14} color="#7C5CFF" />
            <span>3D GIS Basemap</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Column 1: Interactive Map Container Card */}
        <div style={{
          background: 'linear-gradient(145deg, #0B1730 0%, #060E1E 100%)',
          border: '1px solid rgba(120, 170, 255, 0.22)',
          borderRadius: '16px',
          padding: '18px',
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          height: '740px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#F5F8FF', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <MapPin size={18} color="#20D9FF" />
              Metropolitan Digital Twin Geospatial View
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#91A4C5', fontWeight: 600 }}>
              Interactive Doppler Heatmap Layer
            </span>
          </div>

          <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(120, 170, 255, 0.15)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
            <LiveCityMap locations={locations} anomalies={anomalies} />
          </div>
        </div>

        {/* Column 2: 3D Telemetry Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '740px' }}>

          {/* PANEL 1: 3D Monitored Zones Telemetry */}
          <div style={{
            background: 'linear-gradient(145deg, #0B1730 0%, #060E1E 100%)',
            border: '1px solid rgba(120, 170, 255, 0.22)',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -2px 6px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#F5F8FF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#1EA7FF" />
                Monitored Zones Telemetry
              </h3>
              <span style={{
                background: 'rgba(30, 167, 255, 0.12)',
                border: '1px solid rgba(30, 167, 255, 0.3)',
                color: '#1EA7FF',
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {locations.length || 8} Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {locations.map((loc) => {
                const riskVal = loc.risk_score || 50;
                const isHighRisk = riskVal > 75;
                const isMedRisk = riskVal > 55;
                const statusColor = isHighRisk ? '#FF5A67' : isMedRisk ? '#FFB020' : '#27D17F';
                const statusBg = isHighRisk 
                  ? 'linear-gradient(135deg, rgba(255, 90, 103, 0.22) 0%, rgba(255, 90, 103, 0.08) 100%)' 
                  : isMedRisk 
                  ? 'linear-gradient(135deg, rgba(255, 176, 32, 0.22) 0%, rgba(255, 176, 32, 0.08) 100%)' 
                  : 'linear-gradient(135deg, rgba(39, 209, 127, 0.22) 0%, rgba(39, 209, 127, 0.08) 100%)';

                const congestionPct = Math.round((loc.congestion_index || 0.5) * 100);

                return (
                  <div
                    key={loc.location_id || loc.id || loc.location_name}
                    onMouseEnter={() => setHoveredZone(loc.location_name)}
                    onMouseLeave={() => setHoveredZone(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: hoveredZone === loc.location_name 
                        ? 'linear-gradient(135deg, #101E3A 0%, #0D1932 100%)' 
                        : 'linear-gradient(135deg, rgba(16, 30, 58, 0.6) 0%, rgba(11, 23, 48, 0.6) 100%)',
                      border: hoveredZone === loc.location_name 
                        ? '1px solid rgba(32, 217, 255, 0.4)' 
                        : '1px solid rgba(120, 170, 255, 0.15)',
                      boxShadow: hoveredZone === loc.location_name 
                        ? '0 6px 18px rgba(0,0,0,0.4), 0 0 12px rgba(32, 217, 255, 0.15)' 
                        : '0 4px 12px rgba(0,0,0,0.25)',
                      transform: hoveredZone === loc.location_name ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Left Details */}
                    <div style={{ flex: 1, paddingRight: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* 3D LED Status Dot */}
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusColor,
                          boxShadow: `0 0 10px ${statusColor}`,
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#F5F8FF', letterSpacing: '-0.01em' }}>
                          {loc.location_name}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.72rem', color: '#91A4C5' }}>
                        <span>AQI <strong style={{ color: loc.aqi > 150 ? '#FF5A67' : loc.aqi > 100 ? '#FFB020' : '#27D17F' }}>{loc.aqi || 137}</strong></span>
                        <span>•</span>
                        <span>Congestion <strong style={{ color: congestionPct > 75 ? '#FF5A67' : '#20D9FF' }}>{congestionPct}%</strong></span>
                      </div>

                      {/* Micro 3D Progress Bar */}
                      <div style={{ height: '3px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, congestionPct)}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, #20D9FF 0%, ${statusColor} 100%)`,
                          borderRadius: '2px'
                        }} />
                      </div>
                    </div>

                    {/* Right 3D Metallic Risk Badge */}
                    <div style={{
                      background: statusBg,
                      border: `1px solid ${statusColor}`,
                      color: statusColor,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      boxShadow: `0 4px 12px ${statusColor}30`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}>
                      <span>RISK {riskVal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL 2: 3D Active Incident Feed */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(145deg, #0B1730 0%, #060E1E 100%)',
            border: '1px solid rgba(120, 170, 255, 0.22)',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -2px 6px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header & Filter Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#F5F8FF', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Flame size={18} color="#FF5A67" style={{ filter: 'drop-shadow(0 0 6px rgba(255,90,103,0.5))' }} />
                Active Incident Feed
              </h3>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{
                  background: '#101E3A',
                  border: '1px solid rgba(120, 170, 255, 0.25)',
                  color: '#F5F8FF',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL" style={{ background: '#0B1730' }}>All Severities</option>
                <option value="Critical" style={{ background: '#0B1730' }}>Critical</option>
                <option value="High" style={{ background: '#0B1730' }}>High</option>
                <option value="Medium" style={{ background: '#0B1730' }}>Medium</option>
              </select>
            </div>

            {/* Scrollable Incident Feed */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
              {filteredAnomalies.length === 0 ? (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#91A4C5',
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: '#101E3A',
                  borderRadius: '12px',
                  border: '1px dashed rgba(120, 170, 255, 0.2)'
                }}>
                  <ShieldAlert size={24} color="#91A4C5" style={{ marginBottom: '8px' }} />
                  <div>No active municipal incidents matching current filter.</div>
                </div>
              ) : (
                filteredAnomalies.map((incident, i) => {
                  const isCrit = incident.severity === 'Critical';
                  const isHigh = incident.severity === 'High';
                  const sevColor = isCrit ? '#FF5A67' : isHigh ? '#FFB020' : '#1EA7FF';
                  const sevBg = isCrit 
                    ? 'rgba(255, 90, 103, 0.15)' 
                    : isHigh 
                    ? 'rgba(255, 176, 32, 0.15)' 
                    : 'rgba(30, 167, 255, 0.15)';

                  return (
                    <div
                      key={i}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #101E3A 0%, #0B1730 100%)',
                        border: '1px solid rgba(120, 170, 255, 0.18)',
                        borderLeft: `5px solid ${sevColor}`,
                        boxShadow: `0 6px 16px rgba(0,0,0,0.35), -4px 0 12px ${sevColor}30`,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertTriangle size={15} color={sevColor} />
                          <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#F5F8FF' }}>
                            {incident.anomaly_type}
                          </span>
                        </div>

                        <span style={{
                          background: sevBg,
                          border: `1px solid ${sevColor}`,
                          color: sevColor,
                          fontSize: '0.64rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          letterSpacing: '0.06em'
                        }}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: '#91A4C5', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                        {incident.explanation}
                      </p>

                      <div style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        color: '#64748b',
                        background: 'rgba(5, 11, 24, 0.6)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(120, 170, 255, 0.1)'
                      }}>
                        <span style={{ color: '#F5F8FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="#20D9FF" />
                          {incident.location_name}
                        </span>

                        <span style={{ color: '#20D9FF', fontWeight: 800 }}>
                          Score: {incident.anomaly_score ? (incident.anomaly_score * 100).toFixed(0) + '%' : '0.94'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  );
};

export default LiveCity;
