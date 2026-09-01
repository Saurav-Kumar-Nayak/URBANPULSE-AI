import React from 'react';
import Modal from './Modal';
import Badge from './Badge';
import { Database, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, BarChart2 } from 'lucide-react';

export const EvidenceModal = ({ isOpen, onClose, insight }) => {
  if (!insight) return null;

  const {
    id,
    title,
    category,
    what_changed,
    where,
    significance,
    contributing_factors = [],
    risk_level,
    recommended_action,
    evidence = {},
    evidence_type = 'Statistical'
  } = insight;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Statistical Evidence Audit — ${id || 'INSIGHT'}`} maxWidth="680px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header Title & Badges */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Category: {category} • {where}
            </span>
            <span className={`badge ${risk_level === 'High' || risk_level === 'Critical' ? 'badge-rose' : (risk_level === 'Moderate' || risk_level === 'Medium' ? 'badge-amber' : 'badge-emerald')}`}>
              {risk_level || 'Normal'} Risk
            </span>
          </div>

          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
            {title}
          </h4>
        </div>

        {/* What Changed & Significance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="card-panel" style={{ padding: '14px', background: 'rgba(11, 17, 30, 0.9)' }}>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Observed Deviation (WHAT)
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {what_changed}
            </div>
          </div>

          <div className="card-panel" style={{ padding: '14px', background: 'rgba(11, 17, 30, 0.9)' }}>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Significance Level (IMPACT)
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {significance || 'Moderate'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} />
              <span>Evidence Type: {evidence_type}</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors (WHY) */}
        {contributing_factors.length > 0 && (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color="#f59e0b" />
              <span>Contributing Environmental & Traffic Factors (WHY)</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.80rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {contributing_factors.map((factor, idx) => (
                <li key={idx} style={{ lineHeight: 1.4 }}>
                  <strong style={{ color: '#cbd5e1' }}>{factor}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Telemetry Metric Values Table */}
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Database size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
              Raw Telemetry Evidence Payload
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {Object.entries(evidence).map(([key, val]) => (
              <div key={key} style={{ background: 'rgba(7, 11, 18, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  {key.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {typeof val === 'number' ? (val % 1 === 0 ? val : val.toFixed(1)) : String(val)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#38bdf8" />
            <span>Recommended Municipal Action</span>
          </div>
          <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5, fontWeight: 600 }}>
            {recommended_action}
          </div>
        </div>

        {/* Footer Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 20px', borderRadius: '8px' }}
          >
            Close Audit Window
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default EvidenceModal;
