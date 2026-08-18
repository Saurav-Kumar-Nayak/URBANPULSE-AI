import React, { useState, useEffect } from 'react';
import { HourlyTrafficChart, ModeDistributionChart } from '../components/ChartComponents';
import { api } from '../services/api';
import { BarChart3, Activity, Gauge, MapPin } from 'lucide-react';

export default function AnalyticsPage() {
  const [traffic, setTraffic] = useState([]);
  const [modes, setModes] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    Promise.all([api.getTrafficFlow(), api.getModes(), api.getZones()])
      .then(([t, m, z]) => {
        setTraffic(t);
        setModes(m);
        setZones(z);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="text-gradient-cyan">
          Traffic Density & Congestion Analytics
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Detailed speed-versus-congestion profiles and transit mode utilization across urban corridors
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <HourlyTrafficChart trafficData={traffic} />
        <ModeDistributionChart modeData={modes} />
      </div>

      {/* Zone Grid Summary */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
          City Zone Telemetry Index
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {zones.map((z) => (
            <div key={z.zone_id} className="glass-panel" style={{ padding: '16px', background: 'rgba(15,23,42,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>{z.zone_name}</span>
                <span className="badge badge-cyan">{z.zone_id}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Congestion: <strong style={{ color: z.congestion > 0.7 ? 'var(--accent-rose)' : 'var(--primary-emerald)' }}>{Math.round(z.congestion * 100)}%</strong></div>
                <div>Avg Speed: <strong>{z.avg_speed} km/h</strong></div>
                <div>Active Fleet: <strong>{z.active_vehicles} vehicles</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
