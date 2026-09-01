import React from 'react';
import { Wind, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export const AQIKPICards = ({ avgAqi = 101, maxAqi = 358, pm25Val = 28.5, primaryPollutant = "PM2.5" }) => {
  
  // Calculate AQI category & status
  const getAQICategory = (val) => {
    if (val <= 50) return { label: 'GOOD', color: '#27D17F', bg: 'rgba(39, 209, 127, 0.15)', desc: 'Air quality is satisfactory and poses little or no risk.' };
    if (val <= 100) return { label: 'MODERATE', color: '#FFB020', bg: 'rgba(255, 176, 32, 0.15)', desc: 'Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor exertion.' };
    if (val <= 150) return { label: 'UNHEALTHY (SENSITIVE)', color: '#FF9800', bg: 'rgba(255, 152, 0, 0.15)', desc: 'Members of sensitive groups may experience health effects.' };
    if (val <= 200) return { label: 'UNHEALTHY', color: '#FF5A67', bg: 'rgba(255, 90, 103, 0.15)', desc: 'Everyone may begin to experience health effects.' };
    return { label: 'VERY POOR', color: '#FF5A67', bg: 'rgba(255, 90, 103, 0.2)', desc: 'Health warnings of emergency conditions. The entire population is affected.' };
  };

  const currentCat = getAQICategory(avgAqi);
  const peakCat = getAQICategory(maxAqi);
  const pmPercentage = Math.min(100, Math.round((pm25Val / 35.0) * 100));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>

      {/* CARD 1: CURRENT AQI */}
      <div style={{
        background: '#0B1730',
        border: '1px solid rgba(120, 170, 255, 0.18)',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CURRENT AQI
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#F5F8FF', lineHeight: 1 }}>
                {avgAqi}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#91A4C5' }}>AQI</span>
            </div>
          </div>

          <span style={{
            background: currentCat.bg,
            border: `1px solid ${currentCat.color}`,
            color: currentCat.color,
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '20px',
            letterSpacing: '0.05em'
          }}>
            {currentCat.label}
          </span>
        </div>

        {/* Horizontal AQI Scale Progress Bar */}
        <div style={{ margin: '16px 0 12px 0' }}>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (avgAqi / 300) * 100)}%`,
              height: '100%',
              background: `linear-gradient(90deg, #27D17F 0%, #FFB020 50%, #FF5A67 100%)`,
              borderRadius: '3px'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#91A4C5', marginTop: '4px', fontWeight: 600 }}>
            <span>0 Good</span>
            <span>100 Mod</span>
            <span>200 Poor</span>
            <span>300+ Hazard</span>
          </div>
        </div>

        {/* Health Interpretation */}
        <div style={{
          background: '#101E3A',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.75rem',
          color: '#91A4C5',
          lineHeight: '1.4',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Wind size={16} color={currentCat.color} style={{ flexShrink: 0 }} />
          <span>{currentCat.desc}</span>
        </div>
      </div>

      {/* CARD 2: PEAK RECORDED AQI */}
      <div style={{
        background: '#0B1730',
        border: '1px solid rgba(120, 170, 255, 0.18)',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PEAK RECORDED AQI
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#FF5A67', lineHeight: 1 }}>
                {maxAqi}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#91A4C5' }}>AQI</span>
            </div>
          </div>

          <span style={{
            background: 'rgba(255, 90, 103, 0.15)',
            border: '1px solid #FF5A67',
            color: '#FF5A67',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '20px',
            letterSpacing: '0.05em'
          }}>
            VERY POOR
          </span>
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F5F8FF', marginTop: '8px' }}>
          Saheed Nagar Industrial Spike
        </div>

        {/* Mini Sparkline Visualization */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px', marginTop: '12px' }}>
          {[40, 45, 60, 55, 90, 140, 220, 358, 280, 190, 130, 105].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(h / 358) * 100}%`,
                background: h > 200 ? '#FF5A67' : h > 100 ? '#FFB020' : '#27D17F',
                borderRadius: '2px 2px 0 0',
                opacity: i === 7 ? 1 : 0.65
              }}
              title={`Step ${i+1}: ${h} AQI`}
            />
          ))}
        </div>

        <div style={{ fontSize: '0.68rem', color: '#91A4C5', marginTop: '8px', fontWeight: 600 }}>
          Peak threshold detected during heavy traffic & industrial shift window.
        </div>
      </div>

      {/* CARD 3: PRIMARY POLLUTANT */}
      <div style={{
        background: '#0B1730',
        border: '1px solid rgba(120, 170, 255, 0.18)',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '16px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.72rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PRIMARY POLLUTANT
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#20D9FF', marginTop: '4px' }}>
            {primaryPollutant}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F5F8FF', marginTop: '2px' }}>
            {pm25Val} <span style={{ fontSize: '0.8rem', color: '#91A4C5' }}>µg/m³</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#91A4C5', marginTop: '8px', fontWeight: 600 }}>
            {pmPercentage}% of WHO safe threshold (35 µg/m³)
          </div>
        </div>

        {/* Circular SVG Gauge */}
        <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
          <svg width="84" height="84" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#101E3A"
              strokeWidth="3.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#20D9FF"
              strokeWidth="3.5"
              strokeDasharray={`${pmPercentage}, 100`}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 900, color: '#F5F8FF'
          }}>
            {pmPercentage}%
          </div>
        </div>
      </div>

    </div>
  );
};

export default AQIKPICards;
