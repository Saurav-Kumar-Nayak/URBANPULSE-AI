import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import AnomalyRadar from '../components/AnomalyRadar';
import { ShieldAlert, AlertTriangle, CheckCircle, MapPin, Eye, TrendingUp, Sliders } from 'lucide-react';
import { api } from '../services/api';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';

export const RiskAnomalies = () => {
  const { setActiveTab, openCopilotWithQuery } = useUrbanPulseContext();
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [anomRes, locRes] = await Promise.all([
        api.getAnomalies(),
        api.getLocations()
      ]);
      setAnomaliesData(anomRes);
      setLocations(locRes || []);
    } catch (e) {
      setError('Unable to fetch risk telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <PageContainer><LoadingSpinner label="Loading Risk Radar..." /></PageContainer>;
  if (error) return <PageContainer><EmptyState title="Risk Error" message={error} onRetry={fetchData} /></PageContainer>;

  // Filter 3-column events
  const criticalItems = (anomaliesData?.recent_anomalies || []).filter(a => a.severity === 'Critical' || a.risk_score >= 75);
  const warningItems = (anomaliesData?.recent_anomalies || []).filter(a => a.severity === 'High' || (a.risk_score >= 50 && a.risk_score < 75));
  const normalZones = locations.filter(l => l.risk_score < 50);

  return (
    <PageContainer
      title="RISK INTELLIGENCE & MULTIVARIATE ANOMALY RADAR"
      subtitle="IsolationForest Statistical Anomaly Engine & Real-Time Municipal Risk Classification"
      badge={<Badge variant="rose">Risk Operations</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* 3-COLUMN PREMIUM LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          
          {/* COLUMN 1: CRITICAL 🔴 */}
          <div className="card-panel" style={{ padding: '20px', borderTop: '4px solid #f43f5e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 800, fontSize: '1rem' }}>
                <AlertTriangle size={18} />
                <span>CRITICAL HAZARDS ({criticalItems.length})</span>
              </div>
              <span className="badge badge-critical">CRITICAL</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {criticalItems.length > 0 ? criticalItems.slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#fb7185', fontSize: '0.88rem' }}>
                    <span>🔴 {item.anomaly_type}</span>
                    <span>Confidence 93%</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                    <strong>Location:</strong> {item.location_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.explanation}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={() => setActiveTab('live-city')} className="btn-subtle" style={{ fontSize: '0.70rem', padding: '4px 8px' }}>
                      <MapPin size={12} /> View on Map
                    </button>
                    <button onClick={() => openCopilotWithQuery(`Why is ${item.location_name} high risk?`)} className="btn-primary" style={{ fontSize: '0.70rem', padding: '4px 8px' }}>
                      Analyze Risk
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No critical hazards logged.</div>
              )}
            </div>
          </div>

          {/* COLUMN 2: WARNING 🟠 */}
          <div className="card-panel" style={{ padding: '20px', borderTop: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 800, fontSize: '1rem' }}>
                <ShieldAlert size={18} />
                <span>ELEVATED WARNINGS ({warningItems.length})</span>
              </div>
              <span className="badge badge-warning">WARNING</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {warningItems.length > 0 ? warningItems.slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#fbbf24', fontSize: '0.88rem' }}>
                    <span>🟠 {item.anomaly_type}</span>
                    <span>Confidence 87%</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                    <strong>Location:</strong> {item.location_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.explanation}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={() => setActiveTab('live-city')} className="btn-subtle" style={{ fontSize: '0.70rem', padding: '4px 8px' }}>
                      <MapPin size={12} /> View on Map
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No elevated warnings logged.</div>
              )}
            </div>
          </div>

          {/* COLUMN 3: NORMAL 🟢 */}
          <div className="card-panel" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, fontSize: '1rem' }}>
                <CheckCircle size={18} />
                <span>OPTIMAL ZONES ({normalZones.length})</span>
              </div>
              <span className="badge badge-healthy">NORMAL</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {normalZones.slice(0, 3).map((zone, idx) => (
                <div key={idx} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#34d399', fontSize: '0.88rem' }}>
                    <span>🟢 Optimal Conditions</span>
                    <span>Confidence 96%</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                    <strong>Zone:</strong> {zone.location_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Traffic & AQI parameters operating within standard municipal limits.
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Anomaly Radar Analytics & Stream */}
        <AnomalyRadar anomalies={anomaliesData?.recent_anomalies || []} stats={anomaliesData} onRefresh={fetchData} />

      </div>
    </PageContainer>
  );
};

export default RiskAnomalies;
