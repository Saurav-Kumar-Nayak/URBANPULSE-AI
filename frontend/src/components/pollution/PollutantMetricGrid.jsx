import React from 'react';
import { Droplets, Gauge, Shield, Wind, Flame, CloudSun } from 'lucide-react';

export const PollutantMetricGrid = ({ pm10Val = 46, no2Val = 22, o3Val = 18, coVal = 0.6, so2Val = 7, humidityVal = 65 }) => {

  const metrics = [
    { name: 'PM10', label: 'Coarse Particulate', value: pm10Val, unit: 'µg/m³', status: 'Moderate', color: '#FFB020', max: 100, icon: Wind },
    { name: 'NO₂', label: 'Nitrogen Dioxide', value: no2Val, unit: 'µg/m³', status: 'Good', color: '#27D17F', max: 80, icon: Flame },
    { name: 'O₃', label: 'Ground Ozone', value: o3Val, unit: 'µg/m³', status: 'Good', color: '#27D17F', max: 100, icon: CloudSun },
    { name: 'CO', label: 'Carbon Monoxide', value: coVal, unit: 'mg/m³', status: 'Good', color: '#27D17F', max: 4.0, icon: Gauge },
    { name: 'SO₂', label: 'Sulfur Dioxide', value: so2Val, unit: 'µg/m³', status: 'Good', color: '#27D17F', max: 50, icon: Shield },
    { name: 'Humidity', label: 'Relative Humidity', value: humidityVal, unit: '%', status: 'Moderate', color: '#20D9FF', max: 100, icon: Droplets },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#F5F8FF', marginBottom: '14px' }}>
        Detailed Environmental Telemetry
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {metrics.map((m, idx) => {
          const IconComp = m.icon;
          const pct = Math.min(100, Math.round((m.value / m.max) * 100));

          return (
            <div
              key={idx}
              style={{
                background: '#0B1730',
                border: '1px solid rgba(120, 170, 255, 0.18)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconComp size={15} color={m.color} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#F5F8FF' }}>{m.name}</span>
                </div>

                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: m.color,
                  background: `${m.color}15`,
                  border: `1px solid ${m.color}40`,
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {m.status}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F5F8FF', lineHeight: 1 }}>
                  {m.value} <span style={{ fontSize: '0.72rem', color: '#91A4C5', fontWeight: 600 }}>{m.unit}</span>
                </div>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5', marginTop: '2px', fontWeight: 600 }}>
                  {m.label}
                </div>
              </div>

              {/* Progress Mini Bar */}
              <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: m.color, borderRadius: '2px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollutantMetricGrid;
