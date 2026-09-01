import React from 'react';
import { Radio, Wifi, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TelemetryStatus = () => {
  const telemetryData = [
    { label: 'Sensors Online', value: '24 / 24', sub: '100% Operational', icon: Radio, color: '#27D17F' },
    { label: 'Data Freshness', value: '12 sec ago', sub: 'Live MQTT Stream', icon: Clock, color: '#20D9FF' },
    { label: 'Coverage', value: '98.7%', sub: 'Bhubaneswar Metro', icon: Wifi, color: '#1EA7FF' },
    { label: 'Last Calibration', value: '2 days ago', sub: 'NIST Standardized', icon: ShieldCheck, color: '#7C5CFF' },
    { label: 'System Status', value: 'Operational', sub: 'Zero Packet Loss', icon: CheckCircle2, color: '#27D17F' }
  ];

  return (
    <div style={{
      background: '#0B1730',
      border: '1px solid rgba(120, 170, 255, 0.18)',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
    }}>
      <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#F5F8FF', marginBottom: '14px' }}>
        Municipal Telemetry Node Status
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {telemetryData.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#101E3A',
                border: '1px solid rgba(120, 170, 255, 0.15)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                background: `${item.color}15`,
                border: `1px solid ${item.color}40`,
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <IconComp size={16} color={item.color} />
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#F5F8FF', marginTop: '1px' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.6rem', color: item.color, fontWeight: 600 }}>
                  {item.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TelemetryStatus;
