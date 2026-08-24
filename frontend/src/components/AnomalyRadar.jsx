import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangle, ShieldAlert, Cpu, CheckCircle2, Play } from 'lucide-react';
import { api } from '../services/api';

export default function AnomalyRadar({ anomalies: initialAnomalies = [], stats: initialStats = null, onRefresh }) {
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [fetchedAnomalies, setFetchedAnomalies] = useState(initialAnomalies);
  const [fetchedStats, setFetchedStats] = useState(initialStats);

  const fetchAnomaliesData = async () => {
    try {
      const res = await api.getAnomalies();
      if (res) {
        setFetchedAnomalies(res.recent_anomalies || []);
        setFetchedStats({
          severity_breakdown: res.severity_breakdown,
          anomaly_types: res.anomaly_types
        });
      }
    } catch (err) {
      console.error("Failed to load anomalies telemetry:", err);
    }
  };

  useEffect(() => {
    if (initialAnomalies && initialAnomalies.length > 0) {
      setFetchedAnomalies(initialAnomalies);
      setFetchedStats(initialStats);
    } else {
      fetchAnomaliesData();
    }
  }, [initialAnomalies, initialStats]);

  const anomalies = fetchedAnomalies;
  const stats = fetchedStats;

  const severityBreakdown = stats?.severity_breakdown || { Critical: 71, High: 47, Medium: 123 };
  const typeCounts = stats?.anomaly_types || { "Air Quality Hazard": 56, "Multi-Vector Urban Risk": 54, "Severe Gridlock": 67, "Traffic Bottleneck": 64 };

  const barData = Object.keys(typeCounts).map(key => ({
    name: key,
    count: typeCounts[key]
  }));

  const handleRunSimulator = async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const testPayload = {
        traffic_density: 380,
        congestion_index: 0.94,
        avg_speed_kmh: 7.2,
        aqi: 178,
        pm25: 84.0,
        risk_score: 88.5
      };
      const res = await api.detectAnomaly(testPayload);
      setSimResult(res.detection);
      await fetchAnomaliesData();
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error("Anomaly test simulation error:", e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Anomaly Overview Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Severity Breakdown */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--accent-rose)" />
            Anomaly Severity Distribution
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--accent-rose)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>Critical</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{severityBreakdown.Critical || 0}</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(245,158,11,0.1)', border: '1px solid var(--accent-amber)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>High</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{severityBreakdown.High || 0}</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(6,182,212,0.1)', border: '1px solid var(--primary-cyan)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)' }}>Medium</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>{severityBreakdown.Medium || 0}</div>
            </div>
          </div>
        </div>

        {/* Anomaly Types Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px' }}>
            Anomaly Types Frequency
          </h3>
          <div style={{ height: '160px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Events" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Development Anomaly Test Simulator */}
      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15,23,42,0.6)', border: '1px dashed var(--primary-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
              🧪 Development Anomaly Injection Simulator
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Runs live IsolationForest detection on simulated high-concurrency surge payload
            </div>
          </div>
          <button 
            onClick={handleRunSimulator}
            disabled={simulating}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            <Play size={14} className={simulating ? 'spin' : ''} />
            {simulating ? 'Running Detector...' : 'Inject Test Anomaly Payload'}
          </button>
        </div>

        {simResult && (
          <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(244,63,94,0.1)', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid var(--accent-rose)' }}>
            <strong>IsolationForest Output: </strong> {simResult.is_anomaly ? '⚠️ ANOMALY CONFIRMED' : 'NORMAL'} • Type: {simResult.anomaly_type} • Score: {simResult.decision_score}
            <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>{simResult.explanation}</div>
          </div>
        )}
      </div>

      {/* 3. Recent Anomaly Stream Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: '16px' }}>
          Recent Anomaly Log Stream
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Record Code</th>
                <th style={{ whiteSpace: 'nowrap' }}>Location</th>
                <th style={{ whiteSpace: 'nowrap' }}>Timestamp</th>
                <th style={{ whiteSpace: 'nowrap' }}>Anomaly Type</th>
                <th style={{ whiteSpace: 'nowrap' }}>Severity</th>
                <th style={{ whiteSpace: 'nowrap' }}>Risk Score</th>
                <th style={{ whiteSpace: 'nowrap' }}>Evidence Explanation</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anom) => (
                <tr key={anom.id || anom.record_code}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-cyan)', whiteSpace: 'nowrap' }}>{anom.record_code}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{anom.location_name}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{anom.timestamp}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{anom.anomaly_type}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`badge ${anom.severity === 'Critical' ? 'badge-rose' : (anom.severity === 'High' ? 'badge-amber' : 'badge-subtle')}`}>
                      {anom.severity}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{anom.risk_score}</td>
                  <td 
                    title={anom.explanation}
                    style={{ 
                      fontSize: '0.78rem', 
                      color: 'var(--text-muted)', 
                      maxWidth: '300px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {anom.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
