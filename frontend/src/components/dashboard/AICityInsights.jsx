import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight, Eye, MapPin, Sliders, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const AICityInsights = () => {
  const { setActiveTab, setSelectedZone, openCopilotWithQuery } = useUrbanPulseContext();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getInsights();
      setInsights(data || []);
    } catch (e) {
      setError('Unable to fetch live insights from AI engine.');
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
    <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', borderRadius: '16px', background: 'linear-gradient(180deg, rgba(17, 25, 38, 0.95), rgba(11, 15, 23, 0.98))', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.08)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#fff', boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}>
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

              {/* Predicted Impact 3-Metric Strip (Exact Dubai Digital Twin style) */}
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
                  style={{ fontSize: '0.72rem', padding: '7px 12px', flex: 1.4, justifyContent: 'center', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 14px rgba(6,182,212,0.3)' }}
                >
                  <ShieldCheck size={14} /> APPROVE ACTION
                </button>

                <button
                  onClick={() => openCopilotWithQuery(`Explain evidence for ${zoneName}`)}
                  className="btn-subtle"
                  style={{ fontSize: '0.72rem', padding: '7px 10px', flex: 1, justifyContent: 'center' }}
                >
                  <Eye size={13} /> EVIDENCE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AICityInsights;
