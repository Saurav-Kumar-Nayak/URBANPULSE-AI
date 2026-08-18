import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Car, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function TrafficIntelligenceView({ trafficData = null }) {
  const hourly = trafficData?.hourly_trends || [];
  const locations = trafficData?.location_rankings || [];
  const weekdayWeekend = trafficData?.weekday_vs_weekend || [];
  const forecast = trafficData?.congestion_forecast || [];
  const peakHours = trafficData?.peak_hours || ["08:00", "09:00", "17:00", "18:00"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Peak Hour Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }} className="text-gradient-cyan">
            Corridor Peak-Hour Traffic Density & Speeds
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Hourly congestion index and arterial traffic density aggregation across 8 metropolitan zones
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detected Peak Hours:</span>
          {peakHours.map((h, i) => (
            <span key={i} className="badge badge-rose" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              <Clock size={12} style={{ marginRight: '4px' }} />
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Hourly Traffic Chart */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: '16px' }}>
          24-Hour Traffic Flow Profile
        </h3>
        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#06b6d4" fontSize={12} domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={12} domain={[0, 1.0]} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(val, name) => name === 'congestion_index' ? [`${Math.round(val*100)}%`, 'Congestion Index'] : [val, name]}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="traffic_density" name="Traffic Density (veh/min)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTraffic)" />
              <Area yAxisId="right" type="monotone" dataKey="congestion_index" name="Congestion Index" stroke="#f43f5e" fillOpacity={1} fill="url(#colorCongestion)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Row: Weekday vs Weekend & Location Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Weekday vs Weekend */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px' }}>
            Weekday vs Weekend Commute Profile
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayWeekend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="avg_traffic_density" name="Avg Traffic Density" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg_speed_kmh" name="Avg Speed (km/h)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Congestion Ranking */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px' }}>
            Corridor Congestion Rankings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto' }}>
            {locations.map((loc, idx) => (
              <div key={loc.location_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{idx + 1}. {loc.location_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Speed: {loc.avg_speed} km/h</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${loc.avg_congestion > 0.65 ? 'badge-rose' : (loc.avg_congestion > 0.45 ? 'badge-amber' : 'badge-emerald')}`}>
                    {Math.round(loc.avg_congestion * 100)}% Congestion
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Congestion Forecast */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} color="var(--primary-cyan)" />
          Short-Term Congestion Forecast (Next 12 Hours)
        </h3>
        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="hour_ahead" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 1.0]} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="predicted_congestion" name="Predicted Congestion Index" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="confidence_upper" name="Upper Confidence Limit" stroke="#f43f5e" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
