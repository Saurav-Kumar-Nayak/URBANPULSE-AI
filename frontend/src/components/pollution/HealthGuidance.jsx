import React from 'react';
import { Heart, Activity, UserCheck, AlertCircle } from 'lucide-react';

export const HealthGuidance = ({ avgAqi = 101 }) => {
  return (
    <div style={{
      background: '#0B1730',
      border: '1px solid rgba(120, 170, 255, 0.18)',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Heart size={18} color="#FF5A67" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F5F8FF', margin: 0 }}>
            Today's Air Quality Guidance
          </h3>
        </div>

        {/* General Citizen Guidance */}
        <div style={{
          background: '#101E3A',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '12px',
          borderLeft: '4px solid #20D9FF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#F5F8FF' }}>
            <UserCheck size={16} color="#20D9FF" />
            <span>General Population</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#91A4C5', margin: '6px 0 0 0', lineHeight: 1.45 }}>
            Most citizens can continue normal outdoor activities. Ventilation of indoor spaces is suitable during early morning and late evening hours.
          </p>
        </div>

        {/* Sensitive Groups Guidance */}
        <div style={{
          background: '#101E3A',
          borderRadius: '10px',
          padding: '14px',
          borderLeft: '4px solid #FFB020'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#F5F8FF' }}>
            <AlertCircle size={16} color="#FFB020" />
            <span>Sensitive Groups & Children</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#91A4C5', margin: '6px 0 0 0', lineHeight: 1.45 }}>
            Sensitive individuals (asthma, elderly, children) should consider lighter outdoor activity during peak commute hours (13:00–15:00).
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '14px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(120, 170, 255, 0.12)',
        fontSize: '0.68rem',
        color: '#91A4C5',
        display: 'flex',
        justify: 'space-between',
        fontWeight: 600
      }}>
        <span>WHO & CPCB Air Standards</span>
        <span style={{ color: '#27D17F' }}>● Standard Compliant</span>
      </div>
    </div>
  );
};

export default HealthGuidance;
