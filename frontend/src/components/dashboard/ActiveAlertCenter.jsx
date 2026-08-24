import React from 'react';
import { AlertTriangle, ShieldAlert, Wind, HardHat, Car, ArrowRight } from 'lucide-react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const ActiveAlertCenter = ({ anomalies = [], activeZone = null, onSelectZone, loading = false, error = null }) => {
  const { setActiveTab } = useUrbanPulseContext();

  const fallbackAlerts = [
    {
      id: 'LOC-06',
      type: "Traffic Bottleneck",
      location: "Bhubaneswar Railway Station",
      badge: "Critical",
      icon: ShieldAlert,
      iconColor: "#f43f5e",
      time: "14:44:47",
      speed: 14,
      aqi: 128,
      lat: 20.2650,
      lng: 85.8400,
      x: 38,
      y: 28,
      health: 62,
      risk: "High Risk"
    },
    {
      id: 'LOC-03',
      type: "Air Quality Hazard",
      location: "Saheed Nagar",
      badge: "Critical",
      icon: Wind,
      iconColor: "#f43f5e",
      time: "13:20:12",
      speed: 18,
      aqi: 110,
      lat: 20.2885,
      lng: 85.8420,
      x: 26,
      y: 12,
      health: 68,
      risk: "High Risk"
    },
    {
      id: 'LOC-02',
      type: "High Traffic Density",
      location: "Jayadev Vihar",
      badge: "Warning",
      icon: Car,
      iconColor: "#f59e0b",
      time: "12:46:47",
      speed: 22,
      aqi: 88,
      lat: 20.2980,
      lng: 85.8245,
      x: 16,
      y: 27,
      health: 76,
      risk: "Medium Risk"
    }
  ];

  return (
    <div className="card-panel" style={{ padding: '16px 18px', background: 'rgba(13, 19, 28, 0.95)', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#f43f5e" />
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Alerts
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('anomalies')}
          className="btn-subtle"
          style={{ fontSize: '0.68rem', padding: '3px 8px', gap: '4px' }}
        >
          <span>View All</span>
          <ArrowRight size={10} />
        </button>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {fallbackAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              onClick={() => {
                if (onSelectZone) {
                  onSelectZone({
                    id: alert.id,
                    name: alert.location,
                    speed: alert.speed,
                    aqi: alert.aqi,
                    health: alert.health,
                    risk: alert.risk,
                    lat: alert.lat,
                    lng: alert.lng,
                    x: alert.x,
                    y: alert.y
                  });
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '10px',
                background: activeZone?.name === alert.location ? 'rgba(244, 63, 94, 0.2)' : 'rgba(17, 25, 35, 0.7)',
                border: activeZone?.name === alert.location ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    background: alert.iconColor + '22', 
                    color: alert.iconColor, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 800, color: '#f8fafc' }}>
                    {alert.type}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    {alert.location}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span 
                  style={{ 
                    fontSize: '0.62rem', 
                    fontWeight: 800, 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    background: alert.badge === 'Critical' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                    color: alert.badge === 'Critical' ? '#fb7185' : '#fbbf24'
                  }}
                >
                  {alert.badge}
                </span>
                <div style={{ fontSize: '0.64rem', color: '#64748b', marginTop: '2px' }}>
                  {alert.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveAlertCenter;
