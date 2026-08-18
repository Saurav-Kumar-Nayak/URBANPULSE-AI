import React, { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, ShieldCheck, Activity, Layers, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';

export default function InsightEngineView() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getInsights()
      .then(res => setInsights(res || []))
      .catch(err => console.error("Error fetching AI insights:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ color: 'var(--text-muted)' }}>Generating analytical insights from backend database...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }} className="text-gradient-cyan">
            <Lightbulb size={22} color="var(--primary-cyan)" />
            AI Analytical Insight Engine
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Automated statistical anomaly detection & multi-vector causality analysis derived directly from urban telemetry
          </p>
        </div>

        <div className="badge badge-cyan" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          {insights.length} Data-Driven Insights Active
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {insights.map((item) => {
          const isCritical = item.risk_level === 'High' || item.risk_level === 'Critical';

          return (
            <div key={item.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', background: 'rgba(15,23,42,0.7)', borderLeft: isCritical ? '4px solid var(--accent-rose)' : '4px solid var(--primary-cyan)' }}>
              <div>
                {/* Header Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`badge ${isCritical ? 'badge-rose' : 'badge-amber'}`}>
                    {item.risk_level} Risk Level
                  </span>

                  <span className={`badge ${item.evidence_type === 'Statistical' ? 'badge-emerald' : 'badge-cyan'}`}>
                    {item.evidence_type} Evidence
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {item.title}
                </h3>

                {/* Location */}
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 600, marginBottom: '10px' }}>
                  📍 {item.where}
                </div>

                {/* What Changed */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Observation: </strong>
                  {item.what_changed}
                </div>

                {/* Contributing Factors */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Contributing Factors:
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.contributing_factors.map((factor, fIdx) => (
                      <li key={fIdx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Action & Evidence */}
              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Recommended Intervention:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                  {item.recommended_action}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
