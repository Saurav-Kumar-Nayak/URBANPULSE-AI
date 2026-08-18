import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

const MODE_COLORS = {
  'Taxi': '#06b6d4',
  'Electric-Car': '#10b981',
  'E-Scooter': '#8b5cf6',
  'Bus': '#f59e0b',
  'Metro': '#3b82f6'
};

export function HourlyTrafficChart({ trafficData }) {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.0rem', fontWeight: 700, color: 'var(--text-main)' }}>
            24-Hour Traffic Flow & Congestion Index
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Hourly aggregated trip volume overlay with city-wide congestion
          </p>
        </div>
        <span className="badge badge-cyan">24H Real-Time</span>
      </div>

      <div style={{ height: '260px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip 
              contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="trips" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTrips)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ModeDistributionChart({ modeData }) {
  const data = modeData || [];

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.0rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Mobility Mode Share Distribution
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Trip volume and revenue breakdown by transit mode
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'center' }}>
        <div style={{ height: '180px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="mode"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={MODE_COLORS[entry.mode] || '#06b6d4'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.map((item) => (
            <div key={item.mode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: MODE_COLORS[item.mode] || '#06b6d4'
                }} />
                <span style={{ color: 'var(--text-main)' }}>{item.mode}</span>
              </div>
              <span className="mono" style={{ color: 'var(--text-muted)' }}>
                {item.count} trips (${item.revenue})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
