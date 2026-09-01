import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import LiveCityMap from '../components/LiveCityMap';
import { api } from '../services/api';
import { AlertTriangle, MapPin, Activity, Flame } from 'lucide-react';

export const LiveCity = () => {
  const [locations, setLocations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    api.getLocations().then((res) => setLocations(res || [])).catch(() => {});
    api.getAnomalies().then((res) => setAnomalies(res?.recent_anomalies || [])).catch(() => {});
  }, []);

  const filteredAnomalies = filterSeverity === 'ALL'
    ? anomalies
    : anomalies.filter((a) => a.severity === filterSeverity);

  return (
    <PageContainer
      title="Live City Telemetry"
      subtitle="Real-time metropolitan monitoring, geospatial risk heatmaps, and active incident dispatch"
      badge={<Badge variant="cyan">Real-Time Sync</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Full Interactive Map */}
        <Card style={{ height: '720px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#06b6d4" />
              Metropolitan Digital Twin Geospatial View
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Badge variant="healthy">8 Zones Tracked</Badge>
              <Badge variant="violet">Dark Matter Basemap</Badge>
            </div>
          </div>
          <div style={{ flex: 1, borderRadius: '10px', overflow: 'hidden' }}>
            <LiveCityMap locations={locations} anomalies={anomalies} />
          </div>
        </Card>

        {/* Live Incident Stream & Zones Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '720px' }}>
          {/* Zone Breakdown */}
          <Card>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>
              Monitored Zones Telemetry
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
              {locations.map((loc) => {
                const isHighRisk = loc.risk_score > 60;
                return (
                  <div
                    key={loc.location_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(32, 43, 56, 0.4)',
                      border: '1px solid #202B38',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                        {loc.location_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        AQI {loc.aqi} • Congestion {Math.round((loc.congestion_index || 0) * 100)}%
                      </div>
                    </div>
                    <Badge variant={isHighRisk ? 'warning' : 'healthy'}>
                      Risk {loc.risk_score}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Active Incident Log */}
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="#f43f5e" />
                Active Incident Feed
              </h3>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{
                  backgroundColor: '#0D131C',
                  border: '1px solid #202B38',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                }}
              >
                <option value="ALL">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredAnomalies.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>
                  No active incidents recorded for this filter.
                </div>
              ) : (
                filteredAnomalies.map((incident, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(13, 19, 28, 0.8)',
                      borderLeft: `4px solid ${
                        incident.severity === 'Critical' ? '#f43f5e' : incident.severity === 'High' ? '#f59e0b' : '#3b82f6'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        {incident.anomaly_type}
                      </span>
                      <Badge variant={incident.severity === 'Critical' ? 'critical' : 'warning'}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                      {incident.explanation}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                      <span>{incident.location_name}</span>
                      <span>Score: {incident.anomaly_score}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default LiveCity;
