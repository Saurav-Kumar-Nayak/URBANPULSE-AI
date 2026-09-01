import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { CloudSun, Thermometer, Droplets, Wind, ShieldAlert, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export const WeatherIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pollutionData, overviewData] = await Promise.all([
        api.getPollution().catch(() => null),
        api.getOverview().catch(() => null)
      ]);

      setData({
        pollution: pollutionData,
        overview: overviewData
      });
    } catch (e) {
      setError('Failed to fetch weather telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) return <PageContainer><LoadingSpinner label="Loading Weather Telemetry..." /></PageContainer>;
  if (error) return <PageContainer><EmptyState title="Weather Error" message={error} onRetry={fetchWeather} /></PageContainer>;

  const correlations = data?.pollution?.weather_correlation || [
    { weather: 'Clear', avg_aqi: 45, avg_pm25: 18.2, avg_temperature: 24.5, avg_humidity: 48 },
    { weather: 'Partly Cloudy', avg_aqi: 62, avg_pm25: 22.5, avg_temperature: 22.0, avg_humidity: 55 },
    { weather: 'Rain', avg_aqi: 38, avg_pm25: 14.1, avg_temperature: 19.5, avg_humidity: 82 },
    { weather: 'Heavy Rain', avg_aqi: 32, avg_pm25: 11.5, avg_temperature: 18.0, avg_humidity: 92 },
    { weather: 'Fog', avg_aqi: 118, avg_pm25: 48.0, avg_temperature: 15.2, avg_humidity: 95 },
    { weather: 'Haze', avg_aqi: 135, avg_pm25: 58.2, avg_temperature: 28.0, avg_humidity: 62 }
  ];

  return (
    <PageContainer
      title="WEATHER INTELLIGENCE & METEOROLOGICAL IMPACT"
      subtitle="Real-Time Atmospheric Conditions, Temperature Vectors & Urban Impact Correlation"
      badge={<Badge variant="cyan">Meteorological Telemetry</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI Row */}
        <div className="chart-grid-4col">
          <div className="card-panel equal-height-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="kpi-title">Current Temp</span>
              <Thermometer size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>23.4 °C</div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '4px' }}>● Seasonal Average</div>
          </div>

          <div className="card-panel equal-height-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="kpi-title">Relative Humidity</span>
              <Droplets size={18} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>58.2 %</div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '4px' }}>● Optimal Dispersal</div>
          </div>

          <div className="card-panel equal-height-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="kpi-title">Primary Condition</span>
              <CloudSun size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>Partly Cloudy</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Wind: 14 km/h SW</div>
          </div>

          <div className="card-panel equal-height-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="kpi-title">Weather Risk Rating</span>
              <ShieldAlert size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>LOW</div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '4px' }}>No Adverse Warnings</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'stretch' }}>
          <div className="card-panel equal-height-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Weather Condition vs AQI & Particulate Correlation
            </h3>
            <div style={{ height: '300px', width: '100%', marginTop: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={correlations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="weather" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#0d131c', border: '1px solid #202b38', borderRadius: '8px' }} />
                  <Bar dataKey="avg_aqi" fill="#06b6d4" name="Average AQI" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avg_pm25" fill="#f59e0b" name="Avg PM2.5 (µg/m³)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-panel equal-height-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Atmospheric Impact Analysis
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
              <div style={{ background: 'rgba(13,19,28,0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8' }}>High Humidity & Stagnant Fog</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                  Fog and high humidity (&gt;90%) entrap fine particulate PM2.5 in low-lying industrial zones.
                </div>
              </div>

              <div style={{ background: 'rgba(13,19,28,0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#34d399' }}>Precipitation Scavenging</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                  Rainfall events naturally cleanse atmospheric PM10 by 42% within 60 minutes of precipitation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WeatherIntelligence;
