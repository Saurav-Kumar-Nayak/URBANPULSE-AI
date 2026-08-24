import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Wind, CloudRain, AlertCircle, Thermometer } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from './ui/LoadingSpinner';

export default function PollutionIntelligenceView({ pollutionData: initialData = null }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }
    let isMounted = true;
    api.getPollution()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch pollution data:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [initialData]);

  if (loading) return <LoadingSpinner label="Loading Environmental Telemetry..." />;

  const pollutionData = data;
  const trends = pollutionData?.aqi_trends || [];
  const pmBreakdown = pollutionData?.pm_breakdown || [];
  const weatherCorr = pollutionData?.weather_correlation || [];
  const locationRankings = pollutionData?.location_rankings || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Citywide Average AQI</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-cyan)', margin: '4px 0' }}>
            {pollutionData?.avg_aqi || 68} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>AQI</span>
          </div>
          <div className="badge badge-emerald">Moderate Air Quality</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Peak Recorded AQI</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-rose)', margin: '4px 0' }}>
            {pollutionData?.max_aqi || 188} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>AQI</span>
          </div>
          <div className="badge badge-rose">Harbor Industrial Spike</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Pollutant</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '4px 0' }}>
            PM2.5 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>(Fine Particulate)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg 28.5 µg/m³ vs threshold 35 µg/m³</div>
        </div>
      </div>

      {/* 2. AQI & Particulate Time Series */}
      <div className="glass-panel" style={{ padding: '20px', minWidth: 0 }}>
        <h3 style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: '16px' }}>
          Air Quality Index & Particulate Concentration Trends
        </h3>
        <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="aqi" name="Air Quality Index (AQI)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAqi)" />
              <Area type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorPm25)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Weather Correlation & Location Pollution Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Weather vs AQI */}
        <div className="glass-panel" style={{ padding: '20px', minWidth: 0 }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px' }}>
            Weather Condition vs AQI Correlation
          </h3>
          <div style={{ height: '240px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherCorr}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="weather" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="avg_aqi" name="Avg AQI" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg_humidity" name="Avg Humidity (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Pollution Ranking */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px' }}>
            Location Pollution Hierarchy
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto' }}>
            {locationRankings.map((loc, idx) => (
              <div key={loc.location_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{idx + 1}. {loc.location_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PM2.5: {loc.avg_pm25} µg/m³ • PM10: {loc.avg_pm10} µg/m³</div>
                </div>
                <div>
                  <span className={`badge ${loc.avg_aqi > 100 ? 'badge-rose' : (loc.avg_aqi > 60 ? 'badge-amber' : 'badge-emerald')}`}>
                    {loc.avg_aqi} AQI ({loc.status})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
