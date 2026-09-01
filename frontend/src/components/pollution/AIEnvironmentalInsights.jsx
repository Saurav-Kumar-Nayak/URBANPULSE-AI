import React from 'react';
import { Cpu, AlertCircle, Info, CheckCircle, ArrowRight } from 'lucide-react';

export const AIEnvironmentalInsights = () => {
  const insights = [
    {
      type: 'success',
      icon: CheckCircle,
      color: '#27D17F',
      bg: 'rgba(39, 209, 127, 0.12)',
      border: 'rgba(39, 209, 127, 0.3)',
      time: '12 min ago',
      title: 'Particulate Threshold Standard',
      text: 'PM2.5 concentration is currently 18% below the local safe threshold (35 µg/m³).',
      action: 'Air quality within municipal compliance standards.'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      color: '#FFB020',
      bg: 'rgba(255, 176, 32, 0.12)',
      border: 'rgba(255, 176, 32, 0.3)',
      time: 'Live Advisory',
      title: 'Predictive Atmospheric Stagnation',
      text: 'Air quality is expected to deteriorate between 13:00–15:00 due to low thermal wind dispersion.',
      action: 'Advisory: Sensitive groups reduce outdoor activity in peak afternoon.'
    },
    {
      type: 'info',
      icon: Info,
      color: '#20D9FF',
      bg: 'rgba(32, 217, 255, 0.12)',
      border: 'rgba(32, 217, 255, 0.3)',
      time: 'Telemetry Correlation',
      title: 'Commute Traffic & Particulate Vector',
      text: 'Traffic congestion and fine particulate (PM2.5) show an 89% positive correlation around peak morning hours.',
      action: 'Automated signal optimization deployed to smooth corridor throughput.'
    }
  ];

  return (
    <div style={{
      background: '#0B1730',
      border: '1px solid rgba(120, 170, 255, 0.18)',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Cpu size={18} color="#7C5CFF" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F5F8FF', margin: 0 }}>
          AI Environmental Insights
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {insights.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#101E3A',
                border: `1px solid ${item.border}`,
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                background: item.bg,
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <IconComponent size={18} color={item.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F5F8FF' }}>
                    {item.title}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#91A4C5', fontWeight: 600 }}>
                    {item.time}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#91A4C5', marginTop: '4px', lineHeight: 1.4 }}>
                  {item.text}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  color: item.color,
                  fontWeight: 700,
                  marginTop: '8px'
                }}>
                  <ArrowRight size={12} />
                  <span>{item.action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIEnvironmentalInsights;
