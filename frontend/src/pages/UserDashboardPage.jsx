import React, { useEffect, useState } from 'react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import { 
  Car, Wind, CloudSun, ShieldCheck, AlertTriangle, 
  BrainCircuit, Navigation, Activity, Sparkles, User, 
  ArrowRight, ShieldAlert, Zap, MapPin, Radio, Compass,
  TrendingUp, BarChart3, Globe, Eye
} from 'lucide-react';
import './UserDashboardPage.css';

export const UserDashboardPage = () => {
  const { user, isAuthenticated, setActiveTab, selectedZone } = useUrbanPulseContext();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab('login');
    }
  }, [isAuthenticated, setActiveTab]);

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'Citizen';

  const citizenTelemetryCards = [
    {
      title: 'Traffic Flow',
      value: 'MODERATE (54%)',
      desc: 'Average Speed: 32 km/h across Patia arterial corridors',
      status: 'Normal',
      statusColor: '#38bdf8',
      icon: Car,
      tab: 'traffic',
      sparkline: [40, 48, 55, 62, 54, 50, 54],
      metricLabel: 'Vehicle Count',
      metricVal: '1,420 / hr'
    },
    {
      title: 'Air Quality Index',
      value: 'AQI 84 (MODERATE)',
      desc: 'PM2.5: 38 µg/m³ • Optimal atmospheric dispersal',
      status: 'Good',
      statusColor: '#34d399',
      icon: Wind,
      tab: 'pollution',
      sparkline: [95, 90, 88, 86, 84, 82, 84],
      metricLabel: 'Dispersal Index',
      metricVal: '89.4%'
    },
    {
      title: 'City Weather',
      value: '23.4 °C | Partly Cloudy',
      desc: 'Humidity: 58% • Wind: 14 km/h SW • Met-Radar Active',
      status: 'Optimal',
      statusColor: '#38bdf8',
      icon: CloudSun,
      tab: 'weather',
      sparkline: [21, 22, 23, 24, 23.4, 23, 23.4],
      metricLabel: 'Pressure',
      metricVal: '1013 hPa'
    },
    {
      title: 'Public Safety Rating',
      value: 'SECURE (98.4%)',
      desc: 'Zero active municipal emergency advisories in Patia',
      status: 'Protected',
      statusColor: '#34d399',
      icon: ShieldCheck,
      tab: 'live-city',
      sparkline: [97, 98, 98.2, 98.4, 98.4, 98.4, 98.4],
      metricLabel: 'Emergency Level',
      metricVal: 'LEVEL 0 (CLEAR)'
    },
    {
      title: 'City Alerts & Advisories',
      value: '1 ACTIVE ADVISORY',
      desc: 'Patia Square signal synchronization scheduled optimization',
      status: 'Advisory',
      statusColor: '#fbbf24',
      icon: AlertTriangle,
      tab: 'live-city',
      sparkline: [0, 1, 1, 1, 1, 1, 1],
      metricLabel: 'Response Team',
      metricVal: 'DISPATCHED'
    },
    {
      title: 'AI Mobility Predictions',
      value: 'CONGESTION LOW',
      desc: 'Scikit-Learn model forecasts clear evening peak flow',
      status: 'Predicted',
      statusColor: '#a855f7',
      icon: BrainCircuit,
      tab: 'predictions',
      sparkline: [30, 45, 60, 50, 35, 25, 20],
      metricLabel: 'Model Confidence',
      metricVal: '97.6% R²'
    },
    {
      title: 'Urban Mobility Index',
      value: 'EFFICIENCY +18%',
      desc: 'Public transit bus rapid network operating at peak uptime',
      status: 'Optimal',
      statusColor: '#38bdf8',
      icon: Navigation,
      tab: 'live-city',
      sparkline: [70, 75, 80, 84, 88, 90, 92],
      metricLabel: 'Transit On-Time',
      metricVal: '99.1%'
    }
  ];

  return (
    <div className="dashboard-3d-root">
      
      {/* 3D Realistic Hero Banner */}
      <div className="hero-3d-banner">
        <div className="hero-3d-grid-overlay" />
        
        <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px', boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)' }}>
                <Sparkles size={14} className="pulse-dot online" />
                <span>CITIZEN INTELLIGENCE PORTAL • 3D DIGITAL TWIN</span>
              </div>
              
              <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Welcome, <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.4))' }}>{userName}</span>
              </h1>
              
              <p style={{ fontSize: '0.96rem', color: '#94a3b8', margin: '12px 0 0 0', fontWeight: 500, lineHeight: 1.6 }}>
                Real-world urban telemetry, air quality vectors, AI traffic predictions & photorealistic digital twin signals for <strong style={{ color: '#f8fafc' }}>Bhubaneswar Smart City</strong>.
              </p>
            </div>

            {/* 3D Profile Card */}
            <div className="profile-3d-card">
              <div className="avatar-3d-orb">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>{userName}</div>
                <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>{user?.email}</div>
                <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                  AUTHENTICATED CITIZEN SESSION
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main 3D Dashboard Content */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '36px 28px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', boxShadow: '0 0 12px rgba(56,189,248,0.3)' }}>
              <Activity size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                Live City Status & Telemetry
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                Real-time sensors synced from <strong style={{ color: '#38bdf8' }}>Patia Main Road Corridor</strong>
              </div>
            </div>
          </div>

          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.35)', padding: '6px 16px', borderRadius: '20px', boxShadow: '0 0 12px rgba(52, 211, 153, 0.2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
            LIVE SIGNALS ACTIVE
          </span>
        </div>

        {/* 7 3D Telemetry Cards Grid */}
        <div className="telemetry-3d-grid">
          {citizenTelemetryCards.map((card, idx) => {
            const IconComp = card.icon;
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveTab(card.tab)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="card-3d-stage"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div className="card-3d-icon-box">
                    <IconComp size={24} />
                  </div>

                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      color: card.statusColor, 
                      background: `${card.statusColor}18`, 
                      border: `1px solid ${card.statusColor}40`, 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      boxShadow: `0 0 10px ${card.statusColor}25`
                    }}
                  >
                    {card.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {card.title}
                </div>

                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginTop: '6px', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                  {card.value}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {card.desc}
                </div>

                {/* 3D Mini Sparkline Visual */}
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 12px' }}>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{card.metricLabel}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>{card.metricVal}</div>
                  </div>

                  {/* SVG Sparkline */}
                  <svg width="64" height="24" viewBox="0 0 64 24" style={{ overflow: 'visible' }}>
                    <path
                      d={`M 0 ${24 - (card.sparkline[0] / 100) * 20} L 10 ${24 - (card.sparkline[1] / 100) * 20} L 20 ${24 - (card.sparkline[2] / 100) * 20} L 30 ${24 - (card.sparkline[3] / 100) * 20} L 40 ${24 - (card.sparkline[4] / 100) * 20} L 50 ${24 - (card.sparkline[5] / 100) * 20} L 64 ${24 - (card.sparkline[6] / 100) * 20}`}
                      fill="none"
                      stroke={card.statusColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 800 }}>
                  <span>EXPLORE VECTOR</span>
                  <ArrowRight size={15} style={{ transform: isHovered ? 'translateX(4px)' : 'none', transition: 'transform 0.2s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Photorealistic Digital Twin Live Map Section */}
        <div className="digital-twin-3d-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                <Globe size={16} />
                <span>3D GIS DIGITAL TWIN • PHOTOREALISTIC MAP</span>
              </div>
              <h3 style={{ fontSize: '1.30rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Real-World Urban Aerial Telemetry
              </h3>
            </div>

            <button
              onClick={() => setActiveTab('live-city')}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                padding: '10px 20px',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
              }}
            >
              <Eye size={16} />
              <span>LAUNCH FULL 3D DIGITAL TWIN MAP</span>
            </button>
          </div>

          {/* Interactive Mini Map Card Preview */}
          <div 
            onClick={() => setActiveTab('live-city')}
            style={{ 
              position: 'relative', 
              height: '320px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backgroundImage: 'url(/bhubaneswar_3d_twin.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer',
              boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.7), 0 12px 30px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Dark Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6, 10, 20, 0.2) 0%, rgba(6, 10, 20, 0.75) 100%)' }} />

            {/* Live Holographic Scanner Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', boxShadow: '0 0 16px #38bdf8', animation: 'scanLine 4s infinite ease-in-out' }} />

            {/* Map Pin 1: Patia Main Road */}
            <div style={{ position: 'absolute', top: '45%', left: '52%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(7, 12, 24, 0.9)', border: '1px solid #38bdf8', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)', backdropFilter: 'blur(10px)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} className="pulse-dot online" />
              <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800 }}>Patia Main Road • 32 km/h</span>
            </div>

            {/* Map Pin 2: Saheed Nagar */}
            <div style={{ position: 'absolute', top: '25%', left: '30%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(7, 12, 24, 0.85)', border: '1px solid #34d399', padding: '4px 10px', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              <span style={{ fontSize: '0.70rem', color: '#ffffff', fontWeight: 700 }}>Saheed Nagar • AQI 42</span>
            </div>

            {/* Map Pin 3: Vani Vihar */}
            <div style={{ position: 'absolute', top: '70%', left: '75%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(7, 12, 24, 0.85)', border: '1px solid #a855f7', padding: '4px 10px', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }} />
              <span style={{ fontSize: '0.70rem', color: '#ffffff', fontWeight: 700 }}>Vani Vihar • Transit Active</span>
            </div>

            {/* Bottom Overlay Info */}
            <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', background: 'rgba(15, 23, 42, 0.85)', padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                Zone: <strong style={{ color: '#38bdf8' }}>Patia Main Road Corridor</strong> | GIS Satellite Orthophoto Active
              </div>

              <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>CLICK TO EXPLORE 3D DIGITAL TWIN MAP</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* 3D Quick Citizen Explorer Section */}
        <div style={{ marginTop: '40px', background: 'linear-gradient(145deg, rgba(13, 22, 40, 0.85), rgba(7, 12, 24, 0.95))', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '24px', padding: '28px 32px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Zap size={18} />
            </div>
            Quick Citizen Explorer Vectors
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: '3D Live City Map', tab: 'live-city', desc: 'Photorealistic GIS aerial urban twin', icon: Globe },
              { label: 'Traffic Intelligence', tab: 'traffic', desc: 'Real-time vehicle density & speed vectors', icon: Car },
              { label: 'Air Quality Index', tab: 'pollution', desc: 'PM2.5, PM10 & AQI dispersal maps', icon: Wind },
              { label: 'Weather Telemetry', tab: 'weather', desc: 'Temperature, humidity & Met-Radar', icon: CloudSun },
              { label: 'AI Risk Predictions', tab: 'predictions', desc: 'Machine learning predictive models', icon: BrainCircuit }
            ].map((nav, i) => {
              const IconTile = nav.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(nav.tab)}
                  className="explorer-3d-tile"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <IconTile size={18} color="#38bdf8" />
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff' }}>
                      {nav.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {nav.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserDashboardPage;
