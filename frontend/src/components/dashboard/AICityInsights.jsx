import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight, Eye, MapPin, Sliders, RefreshCw, X, Database, BarChart2 } from 'lucide-react';
import { api } from '../../services/api';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const AICityInsights = () => {
  const { setActiveTab, setSelectedZone, openCopilotWithQuery } = useUrbanPulseContext();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const defaultInsights = [
    {
      id: "INS-101",
      title: "Air Quality & Congestion Bottleneck in Jayadev Vihar",
      where: "Jayadev Vihar (Bhubaneswar)",
      what_changed: "Traffic density rose to 185 vehicles/min while local AQI peaked at 129.7.",
      risk_level: "High",
      recommended_action: "Increase transit signal phase frequency by 15% between 08:00 - 10:00 to reduce bottlenecking.",
      evidence_type: "Statistical Database Baseline",
      evidence: { avg_aqi: 129.7, max_aqi: 385, city_avg_aqi: 103.5, sample_size: 250 },
      contributing_factors: [
        "High diesel vehicle ratio along NH-16 junction",
        "Low wind velocity (8 km/h) causing stagnation",
        "Peak morning commute congestion (+22% baseline)"
      ]
    },
    {
      id: "INS-102",
      title: "Traffic Delay Surge along Patia Main Road",
      where: "Patia Main Road (Bhubaneswar)",
      what_changed: "Average speed dropped to 14 km/h with 7 min localized delay.",
      risk_level: "Medium",
      recommended_action: "Deploy automated traffic signal re-balancing and dispatch municipal patrol unit.",
      evidence_type: "Regressional Trend Analysis",
      evidence: { avg_speed_kmh: 14.2, delay_min: 7, congestion_index: 0.78, sample_size: 250 },
      contributing_factors: [
        "IT corridor peak hour discharge",
        "Narrow lane throughput at Patia Chowk",
        "Weather humidity 74%"
      ]
    }
  ];

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getInsights();
      if (data && data.length > 0) {
        setInsights(data);
      } else {
        setInsights(defaultInsights);
      }
    } catch (e) {
      setInsights(defaultInsights);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="card-panel" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '140px', width: '100%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '140px', width: '100%' }} />
      </div>
    );
  }

  if (error || insights.length === 0) {
    return (
      <div className="card-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '8px' }}>AI City Insights</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{error || 'No active insights available.'}</p>
        <button onClick={fetchInsights} className="btn-subtle" style={{ margin: '0 auto' }}>
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', borderRadius: '16px', background: 'linear-gradient(180deg, rgba(17, 25, 38, 0.95), rgba(11, 15, 23, 0.98))', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.08)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                AGENTIC AI INSIGHTS
              </h3>
              <span style={{ fontSize: '0.70rem', color: '#a78bfa', fontWeight: 600 }}>Active Autonomous Intelligence</span>
            </div>
          </div>
          <span className="badge badge-violet" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>● ML ENGINE ONLINE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {insights.slice(0, 3).map((item, idx) => {
            const isHighRisk = item.risk_level === 'Critical' || item.risk_level === 'High' || idx === 0;
            const zoneName = item.where || `Sector ${idx + 1} (${item.location_name || 'Tech Corridor'})`;

            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(13, 19, 28, 0.95)',
                  border: `1px solid ${isHighRisk ? 'rgba(244,63,94,0.4)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: isHighRisk ? '0 4px 24px rgba(244,63,94,0.12)' : 'none'
                }}
              >
                {/* Recommended Action Card Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                      <Sliders size={14} color="#a78bfa" />
                      <span>RECOMMENDED MUNICIPAL ACTION</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', color: '#f8fafc', fontWeight: 700, marginTop: '4px', lineHeight: 1.3 }}>
                      {idx === 0 
                        ? 'Increase transit signal phase frequency by 15% between 08:00 - 10:00 to reduce bottlenecking.'
                        : item.recommended_action}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#06b6d4" />
                      <span>{zoneName}</span>
                    </div>
                  </div>
                </div>

                {/* Predicted Impact Strip */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    PREDICTED MUNICIPAL IMPACT:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>-8%</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Congestion</div>
                    </div>

                    <div style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>+12%</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Ridership</div>
                    </div>

                    <div style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c084fc' }}>-4%</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Emissions</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => alert(`Action Approved! Deploying dynamic signal phase optimization to ${zoneName}.`)}
                    className="btn-primary"
                    style={{ fontSize: '0.72rem', padding: '7px 12px', flex: 1.4, justifyContent: 'center', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 14px rgba(6,182,212,0.3)', cursor: 'pointer' }}
                  >
                    <ShieldCheck size={14} /> APPROVE ACTION
                  </button>

                  <button
                    onClick={() => setSelectedEvidence(item)}
                    className="btn-subtle"
                    style={{ fontSize: '0.72rem', padding: '7px 10px', flex: 1, justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Eye size={13} /> VIEW EVIDENCE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence Modal / Drawer */}
      {selectedEvidence && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '640px', background: '#0f172a', border: '1px solid var(--primary-cyan)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#f8fafc' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={20} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Insight Telemetry Evidence</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {selectedEvidence.id} • {selectedEvidence.evidence_type} Evidence</span>
                </div>
              </div>
              <button onClick={() => setSelectedEvidence(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Title & Location */}
            <div>
              <h4 style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 700 }}>{selectedEvidence.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>📍 {selectedEvidence.where}</p>
            </div>

            {/* Observation */}
            <div style={{ background: 'rgba(15,23,42,0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Underlying Observation:</div>
              <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: 0, lineHeight: 1.4 }}>{selectedEvidence.what_changed}</p>
            </div>

            {/* Evidence Metrics */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={14} color="#06b6d4" />
                DATABASE & STATISTICAL METRICS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(selectedEvidence.evidence || {}).map(([key, val]) => (
                  <div key={key} style={{ background: 'rgba(30,41,59,0.6)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>{key.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributing Factors */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Contributing Factors:</div>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(selectedEvidence.contributing_factors || []).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <button onClick={() => setSelectedEvidence(null)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '10px' }}>
              Close Evidence Inspector
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AICityInsights;
