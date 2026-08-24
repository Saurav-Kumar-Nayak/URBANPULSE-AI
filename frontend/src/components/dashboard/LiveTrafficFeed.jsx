import React from 'react';
import { Car, ArrowRight } from 'lucide-react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const LiveTrafficFeed = ({ locationRankings = [], activeZone = null, onSelectZone, loading = false, error = null }) => {
  const { setActiveTab } = useUrbanPulseContext();

  const sampleRoads = [
    { id: 'LOC-02', road: "Jayadev Vihar", status: "Heavy Traffic", delay: "11 min delay", color: "#f43f5e", speed: 22, aqi: 88, lat: 20.2980, lng: 85.8245, x: 16, y: 27, health: 76, risk: "Medium Risk" },
    { id: 'LOC-01', road: "Patia Main Road", status: "Moderate Traffic", delay: "7 min delay", color: "#f59e0b", speed: 28, aqi: 72, lat: 20.3588, lng: 85.8184, x: 48, y: 38, health: 84, risk: "Low Risk" },
    { id: 'LOC-06', road: "Bhubaneswar Railway Station", status: "Moderate Traffic", delay: "7 min delay", color: "#f59e0b", speed: 14, aqi: 128, lat: 20.2650, lng: 85.8400, x: 38, y: 28, health: 62, risk: "High Risk" },
    { id: 'LOC-07', road: "Nandankanan Road", status: "Moderate Traffic", delay: "6 min delay", color: "#f59e0b", speed: 30, aqi: 65, lat: 20.3700, lng: 85.8300, x: 62, y: 12, health: 86, risk: "Low Risk" }
  ];

  return (
    <div className="card-panel" style={{ padding: '16px 18px', background: 'rgba(13, 19, 28, 0.95)', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Car size={16} color="#06b6d4" />
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Live Traffic Feed
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('traffic')}
          className="btn-subtle"
          style={{ fontSize: '0.68rem', padding: '3px 8px', gap: '4px' }}
        >
          <span>View All</span>
          <ArrowRight size={10} />
        </button>
      </div>

      {/* Feed Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sampleRoads.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (onSelectZone) {
                onSelectZone({
                  id: item.id,
                  name: item.road,
                  speed: item.speed,
                  aqi: item.aqi,
                  health: item.health,
                  risk: item.risk,
                  lat: item.lat,
                  lng: item.lng,
                  x: item.x,
                  y: item.y
                });
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              background: activeZone?.name === item.road ? 'rgba(59, 130, 246, 0.2)' : 'rgba(17, 25, 35, 0.7)',
              border: activeZone?.name === item.road ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: item.color + '22', 
                  color: item.color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}
              >
                {item.road.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '0.80rem', fontWeight: 700, color: '#f8fafc' }}>
                  {item.road}
                </div>
                <div style={{ fontSize: '0.68rem', color: item.color, fontWeight: 700 }}>
                  {item.status}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: item.color, fontWeight: 800 }}>
                {item.delay}
              </div>
              <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                Updated just now
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTrafficFeed;
