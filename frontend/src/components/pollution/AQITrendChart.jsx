import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AQITrendChart = ({ trendsData = [] }) => {
  const [timeframe, setTimeframe] = useState('24h');

  // Fallback realistic time series data if trendsData is empty
  const defaultData = [
    { timestamp: '00:00', aqi: 52, pm25: 22.4, pm10: 42.1 },
    { timestamp: '03:00', aqi: 48, pm25: 19.8, pm10: 38.5 },
    { timestamp: '06:00', aqi: 75, pm25: 31.2, pm10: 58.0 },
    { timestamp: '09:00', aqi: 128, pm25: 48.6, pm10: 89.2 },
    { timestamp: '12:00', aqi: 145, pm25: 54.1, pm10: 98.4 },
    { timestamp: '15:00', aqi: 110, pm25: 41.3, pm10: 76.8 },
    { timestamp: '18:00', aqi: 168, pm25: 62.5, pm10: 112.0 },
    { timestamp: '21:00', aqi: 95, pm25: 36.7, pm10: 64.3 },
  ];

  const chartData = trendsData.length > 0 ? trendsData : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#071226',
          border: '1px solid rgba(120, 170, 255, 0.25)',
          borderRadius: '10px',
          padding: '12px 14px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          fontSize: '0.78rem'
        }}>
          <div style={{ color: '#F5F8FF', fontWeight: 800, marginBottom: '6px' }}>
            Time: {label}
          </div>
          {payload.map((entry, idx) => (
            <div key={idx} style={{ color: entry.color, fontWeight: 700, margin: '2px 0' }}>
              {entry.name}: {entry.value} {entry.name.includes('AQI') ? '' : 'µg/m³'}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: '#0B1730',
      border: '1px solid rgba(120, 170, 255, 0.18)',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      minWidth: 0
    }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F5F8FF', margin: 0 }}>
            Air Quality Index & Particulate Concentration Trends
          </h3>
          <div style={{ fontSize: '0.75rem', color: '#91A4C5', marginTop: '2px' }}>
            Continuous municipal environmental sensor stream telemetry
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div style={{ display: 'flex', background: '#101E3A', padding: '3px', borderRadius: '8px', border: '1px solid rgba(120, 170, 255, 0.2)' }}>
          {['24h', '7d', '30d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                background: timeframe === tf ? '#1EA7FF' : 'none',
                color: timeframe === tf ? '#ffffff' : '#91A4C5',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts AreaChart */}
      <div style={{ height: '320px', width: '100%', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB020" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#FFB020" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#20D9FF" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#20D9FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 170, 255, 0.1)" />
            <XAxis dataKey="timestamp" stroke="#91A4C5" fontSize={11} tickLine={false} />
            <YAxis stroke="#91A4C5" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '0.78rem', color: '#91A4C5' }} />

            <Area type="monotone" dataKey="aqi" name="AQI Index" stroke="#FFB020" strokeWidth={2.5} fillOpacity={1} fill="url(#gradientAqi)" />
            <Area type="monotone" dataKey="pm25" name="PM2.5 Concentration" stroke="#20D9FF" strokeWidth={2} fillOpacity={1} fill="url(#gradientPm25)" />
            <Area type="monotone" dataKey="pm10" name="PM10 Concentration" stroke="#7C5CFF" strokeWidth={2} fillOpacity={1} fill="url(#gradientPm10)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AQITrendChart;
