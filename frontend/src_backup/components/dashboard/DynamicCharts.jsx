import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Wind, Car, CloudSun, ShieldAlert, Clock, ArrowDown, ArrowUp } from 'lucide-react';

export const DynamicCharts = ({
  pollutionData = null,
  trafficData = null,
  anomaliesData = null,
  overviewData = null,
  activeZone = null,
  activeTimeframe = '24h',
  onTimeframeChange = () => {},
  loading = false
}) => {

  const timeframeOptions = [
    { label: '1H', value: '1h' },
    { label: '6H', value: '6h' },
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' }
  ];

  // Base metrics calculated dynamically from activeZone
  const baseAqi = activeZone?.aqi || pollutionData?.avg_aqi || 72;
  const baseSpeed = activeZone?.speed || 28;
  const basePm25 = (baseAqi * 0.34).toFixed(1);
  const aqiStatus = baseAqi < 75 ? 'Good' : (baseAqi < 100 ? 'Moderate' : 'Unhealthy');

  // Dynamic 24-hour Air Quality Trend based on activeZone
  const aqiTrends = [
    { timestamp: '12 AM', pm25: Math.max(10, Math.round(baseAqi * 0.90)), aqi: Math.round(baseAqi * 0.90) },
    { timestamp: '3 AM', pm25: Math.max(10, Math.round(baseAqi * 0.82)), aqi: Math.round(baseAqi * 0.82) },
    { timestamp: '6 AM', pm25: Math.round(baseAqi * 1.05), aqi: Math.round(baseAqi * 1.05) },
    { timestamp: '9 AM', pm25: Math.round(baseAqi * 1.18), aqi: Math.round(baseAqi * 1.18) },
    { timestamp: '12 PM', pm25: Math.round(baseAqi * 0.98), aqi: Math.round(baseAqi * 0.98) },
    { timestamp: '3 PM', pm25: Math.round(baseAqi * 0.94), aqi: Math.round(baseAqi * 0.94) },
    { timestamp: '6 PM', pm25: Math.round(baseAqi * 1.12), aqi: Math.round(baseAqi * 1.12) },
    { timestamp: '9 PM', pm25: Math.round(baseAqi * 1.02), aqi: Math.round(baseAqi * 1.02) },
    { timestamp: '12 AM', pm25: Math.round(baseAqi * 0.92), aqi: Math.round(baseAqi * 0.92) }
  ];

  // Dynamic Traffic Flow Trend based on activeZone speed
  const trafficTrends = [
    { hour: '12 AM', avg_speed_kmh: Math.round(baseSpeed * 1.40) },
    { hour: '3 AM', avg_speed_kmh: Math.round(baseSpeed * 1.50) },
    { hour: '6 AM', avg_speed_kmh: Math.round(baseSpeed * 1.20) },
    { hour: '9 AM', avg_speed_kmh: Math.max(10, Math.round(baseSpeed * 0.75)) },
    { hour: '12 PM', avg_speed_kmh: Math.round(baseSpeed * 0.95) },
    { hour: '3 PM', avg_speed_kmh: Math.round(baseSpeed * 1.05) },
    { hour: '6 PM', avg_speed_kmh: Math.max(8, Math.round(baseSpeed * 0.70)) },
    { hour: '9 PM', avg_speed_kmh: Math.round(baseSpeed * 1.15) },
    { hour: '12 AM', avg_speed_kmh: Math.round(baseSpeed * 1.35) }
  ];

  // Weather Data
  const currentTemp = activeZone?.temp || '32°C';
  const weatherCards = [
    { day: 'Sat', high: '33°', low: '25°', icon: '☀️' },
    { day: 'Sun', high: '34°', low: '26°', icon: '⛅' },
    { day: 'Mon', high: '33°', low: '25°', icon: '🌧️' },
    { day: 'Tue', high: '32°', low: '24°', icon: '⛈️' },
    { day: 'Wed', high: '31°', low: '24°', icon: '⛅' }
  ];

  // Dynamic Risk Distribution Donut Data
  const isHighRisk = activeZone?.risk?.includes('High') || activeZone?.risk?.includes('Critical');
  const isMedRisk = activeZone?.risk?.includes('Medium');
  
  const highPct = isHighRisk ? 42 : (isMedRisk ? 22 : 12);
  const medPct = isHighRisk ? 38 : (isMedRisk ? 48 : 28);
  const lowPct = Math.max(0, 100 - highPct - medPct);

  const pieData = [
    { name: 'High', value: highPct, color: '#f43f5e' },
    { name: 'Medium', value: medPct, color: '#f59e0b' },
    { name: 'Low', value: lowPct, color: '#10b981' }
  ];

  const overallRiskLevel = activeZone?.risk || (highPct > 30 ? 'High Risk' : (medPct > 35 ? 'Medium Risk' : 'Low Risk'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* GLOBAL TIME RANGE BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13, 19, 28, 0.8)', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
          <Clock size={14} color="#06b6d4" />
          <span>Historical Intelligence Timeframe {activeZone?.name ? `(${activeZone.name})` : ''}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '6px' }}>
          {timeframeOptions.map(tf => (
            <button
              key={tf.value}
              onClick={() => onTimeframeChange(tf.value)}
              style={{
                background: activeTimeframe === tf.value ? '#06b6d4' : 'transparent',
                color: activeTimeframe === tf.value ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 BOTTOM PANELS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'stretch' }} className="command-center-bottom-charts">
        
        {/* Panel 1: AIR QUALITY TREND */}
        <div className="card-panel equal-height-card" style={{ padding: '16px', background: 'rgba(13, 19, 28, 0.95)', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wind size={15} color="#10b981" />
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>Air Quality Trend</h4>
              </div>
              <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '4px', background: baseAqi < 75 ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', color: baseAqi < 75 ? '#34d399' : '#fb7185', fontWeight: 700 }}>
                {aqiStatus}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
                {baseAqi}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                PM2.5 ({basePm25} µg/m³)
              </span>
            </div>
          </div>

          {/* Recharts Area */}
          <div style={{ height: '120px', width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aqiTrends} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={baseAqi < 75 ? "#10b981" : "#f43f5e"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={baseAqi < 75 ? "#10b981" : "#f43f5e"} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" stroke="#475569" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0b0f17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="pm25" stroke={baseAqi < 75 ? "#10b981" : "#f43f5e"} strokeWidth={2} fillOpacity={1} fill="url(#aqiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 2: TRAFFIC FLOW TREND */}
        <div className="card-panel equal-height-card" style={{ padding: '16px', background: 'rgba(13, 19, 28, 0.95)', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Car size={15} color="#38bdf8" />
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>Traffic Flow Trend</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.66rem', color: '#f43f5e', fontWeight: 700 }}>
                <ArrowDown size={12} />
                <span>5%</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
                {baseSpeed} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>km/h</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Avg Speed</span>
            </div>
          </div>

          {/* Recharts Line */}
          <div style={{ height: '120px', width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficTrends} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#475569" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0b0f17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.75rem' }} />
                <Line type="monotone" dataKey="avg_speed_kmh" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 3: WEATHER FORECAST */}
        <div className="card-panel equal-height-card" style={{ padding: '16px', background: 'rgba(13, 19, 28, 0.95)', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CloudSun size={15} color="#f59e0b" />
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>Weather Forecast</h4>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  {currentTemp}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Partly Cloudy
                </div>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
                <div>Feels like: <strong>36°C</strong></div>
                <div>Humidity: <strong>60%</strong></div>
                <div>Wind: <strong>12 km/h</strong></div>
                <div>Rain Chance: <strong>10%</strong></div>
              </div>
            </div>
          </div>

          {/* 5-Day Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: 'auto' }}>
            {weatherCards.map(w => (
              <div key={w.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700 }}>{w.day}</span>
                <span>{w.icon}</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{w.high}</span>
                <span style={{ color: '#64748b' }}>{w.low}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: RISK DISTRIBUTION DONUT */}
        <div className="card-panel equal-height-card" style={{ padding: '16px', background: 'rgba(13, 19, 28, 0.95)', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={15} color="#c084fc" />
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>Risk Distribution</h4>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '10px' }}>
              Overall Risk: <strong style={{ color: overallRiskLevel.includes('High') ? '#f43f5e' : (overallRiskLevel.includes('Medium') ? '#f59e0b' : '#10b981') }}>{overallRiskLevel}</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: '10px', alignItems: 'center', marginTop: 'auto' }}>
            <div style={{ height: '110px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={28}
                    outerRadius={44}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#f43f5e' }}>● High</span>
                <strong style={{ color: '#f8fafc' }}>{highPct}%</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#f59e0b' }}>● Medium</span>
                <strong style={{ color: '#f8fafc' }}>{medPct}%</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#10b981' }}>● Low</span>
                <strong style={{ color: '#f8fafc' }}>{lowPct}%</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DynamicCharts;
