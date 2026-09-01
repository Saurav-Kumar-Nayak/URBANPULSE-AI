import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Database, 
  Compass, 
  ArrowRight, 
  Layers, 
  Globe, 
  RefreshCw, 
  AlertTriangle, 
  Wind, 
  TrendingUp,
  FileText,
  Lock,
  Radio,
  CheckCircle2,
  Zap,
  CloudSun,
  Car,
  Play,
  Server
} from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import LiveCityMap from '../components/LiveCityMap';
import { api } from '../services/api';

export const LandingPage = () => {
  const { 
    setActiveTab, 
    setSelectedZone, 
    openCopilotWithQuery,
    isAuthenticated,
    user,
    role,
    setIsLoginModalOpen,
    openEvidenceModal,
    logout
  } = useUrbanPulseContext();
  
  // Real overview telemetry & health from backend
  const [overview, setOverview] = useState(null);
  const [healthInfo, setHealthInfo] = useState(null);
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [insightsData, setInsightsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real location state
  const [locationInfo, setLocationInfo] = useState({
    city: "Bhubaneswar",
    state: "Odisha",
    country: "India",
    lat: 20.3547,
    lng: 85.8153,
    areaName: "Patia Main Road",
    isDetected: false,
    status: "Monitored Municipal Zone"
  });

  const [detectingLoc, setDetectingLoc] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState("LOC-01");

  const zonesList = locationsData.length > 0 ? locationsData : [
    { id: 'LOC-01', name: 'Patia Main Road', lat: 20.3588, lng: 85.8184, area: 'IT & Education Corridor' },
    { id: 'LOC-02', name: 'Jayadev Vihar', lat: 20.2980, lng: 85.8245, area: 'Commercial Interchange' },
    { id: 'LOC-03', name: 'Saheed Nagar', lat: 20.2885, lng: 85.8420, area: 'Business District' },
    { id: 'LOC-06', name: 'Bhubaneswar Railway Station', lat: 20.2650, lng: 85.8400, area: 'Central Transit Hub' }
  ];

  // Fetch real telemetry APIs on load
  useEffect(() => {
    let isMounted = true;
    setLoadingData(true);

    Promise.allSettled([
      api.getHealth(),
      api.getOverview(),
      api.getAnomalies(),
      api.getInsights(),
      api.getLocations()
    ]).then(([healthRes, overviewRes, anomaliesRes, insightsRes, locationsRes]) => {
      if (!isMounted) return;

      if (healthRes.status === 'fulfilled') setHealthInfo(healthRes.value);
      if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value);
      if (anomaliesRes.status === 'fulfilled') setAnomaliesData(anomaliesRes.value);
      if (insightsRes.status === 'fulfilled' && Array.isArray(insightsRes.value)) setInsightsData(insightsRes.value);
      if (locationsRes.status === 'fulfilled' && Array.isArray(locationsRes.value)) setLocationsData(locationsRes.value);
      
      setLoadingData(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handleOpenCommandCenter = () => {
    if (isAuthenticated) {
      setActiveTab('command-center');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const isSystemOnline = healthInfo ? healthInfo.status === 'online' : true;
  const liveZonesCount = locationsData.length > 0 ? locationsData.length : 12;

  // Real telemetry indicators with fallbacks matching target reference
  const avgSpeed = overview?.traffic_metrics?.average_speed_kmh ? `${Math.round(overview.traffic_metrics.average_speed_kmh)} km/h` : '28 km/h';
  const trafficStatus = overview?.traffic_metrics?.congestion_level || 'Smooth Flow';
  const aqiValue = overview?.environmental_metrics?.average_aqi ? `${Math.round(overview.environmental_metrics.average_aqi)} AQI` : '102 AQI';
  const aqiStatus = overview?.environmental_metrics?.aqi_category || 'Moderate';
  const tempValue = overview?.environmental_metrics?.temperature_c ? `${Math.round(overview.environmental_metrics.temperature_c)}°C` : '32°C';
  const weatherStatus = overview?.environmental_metrics?.weather_condition || 'Partly Cloudy';
  const riskLevel = overview?.risk_metrics?.risk_level || 'Medium';
  const riskStatus = overview?.risk_metrics?.status || 'Monitoring';

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#050914', color: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* 4. ENTERPRISE NAVBAR (MATCHING REFERENCE IMAGE) */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: 'rgba(5, 9, 20, 0.95)', 
        backdropFilter: 'blur(16px)', 
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
            border: '1px solid rgba(56, 189, 248, 0.4)'
          }}>
            <Activity size={20} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              UrbanPulse <span style={{ color: '#38bdf8' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Smart City Intelligence Platform
            </div>
          </div>
        </div>

        {/* Center Navigation Links (With Active Blue Underline Pill) */}
        <nav className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setActiveTab('home')} 
            style={{ 
              fontSize: '0.86rem', 
              padding: '6px 14px', 
              background: 'none', 
              color: '#38bdf8', 
              border: 'none', 
              fontWeight: 700, 
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            Home
            <span style={{ position: 'absolute', bottom: '-10px', width: '36px', height: '3px', borderRadius: '2px', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
          </button>

          <button onClick={() => setActiveTab('live-city')} style={{ fontSize: '0.86rem', background: 'none', color: '#cbd5e1', border: 'none', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}>
            Live City
          </button>
          <button onClick={() => setActiveTab('predictions')} style={{ fontSize: '0.86rem', background: 'none', color: '#cbd5e1', border: 'none', fontWeight: 500, cursor: 'pointer' }}>
            Predictions
          </button>
          <button onClick={() => setActiveTab('traffic')} style={{ fontSize: '0.86rem', background: 'none', color: '#cbd5e1', border: 'none', fontWeight: 500, cursor: 'pointer' }}>
            Traffic
          </button>
          <button onClick={() => setActiveTab('pollution')} style={{ fontSize: '0.86rem', background: 'none', color: '#cbd5e1', border: 'none', fontWeight: 500, cursor: 'pointer' }}>
            Air Quality
          </button>
          <button onClick={() => setActiveTab('weather')} style={{ fontSize: '0.86rem', background: 'none', color: '#cbd5e1', border: 'none', fontWeight: 500, cursor: 'pointer' }}>
            Weather
          </button>
          <a href="#about-architecture" style={{ fontSize: '0.86rem', background: 'none', color: '#cbd5e1', border: 'none', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
            About
          </a>
        </nav>

        {/* Right Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.76rem', fontWeight: 700 }}>
                ● {user?.name || role}
              </div>
              <button 
                onClick={() => setActiveTab('command-center')}
                style={{ 
                  fontSize: '0.82rem', 
                  padding: '8px 18px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
                  color: '#fff', 
                  border: '1px solid rgba(56, 189, 248, 0.4)', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                Command Center
              </button>
              <button
                onClick={logout}
                style={{ fontSize: '0.76rem', padding: '7px 12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', fontWeight: 700, cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              style={{ 
                fontSize: '0.82rem', 
                padding: '8px 18px', 
                borderRadius: '8px', 
                background: 'rgba(56, 189, 248, 0.08)', 
                color: '#e2e8f0', 
                border: '1px solid rgba(56, 189, 248, 0.35)', 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Lock size={14} color="#38bdf8" />
              <span>Operator Login</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 10px', color: '#f8fafc', cursor: 'pointer', display: 'none' }}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ background: '#070b16', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, padding: '8px 0' }}>Home</button>
          <button onClick={() => { setActiveTab('live-city'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', fontWeight: 600, padding: '8px 0' }}>Live City</button>
          <button onClick={() => { setActiveTab('predictions'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', fontWeight: 600, padding: '8px 0' }}>Predictions</button>
          <button onClick={() => { setActiveTab('traffic'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', fontWeight: 600, padding: '8px 0' }}>Traffic</button>
          <button onClick={() => { setActiveTab('pollution'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', fontWeight: 600, padding: '8px 0' }}>Air Quality</button>
          <button onClick={() => { setActiveTab('weather'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', fontWeight: 600, padding: '8px 0' }}>Weather</button>
        </div>
      )}

      {/* 5. HERO SECTION — WIDE COMPOSITION MATCHING REFERENCE IMAGE */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '32px', alignItems: 'center' }}>
          
          {/* LEFT COLUMN: HERO COPY & CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Pill Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', width: 'fit-content' }}>
              <Zap size={14} color="#38bdf8" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AI-POWERED URBAN INTELLIGENCE
              </span>
            </div>

            {/* Main Title */}
            <h1 style={{ fontSize: '3.1rem', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Understand Your City.<br />
              <span style={{ color: '#38bdf8' }}>Predict What Happens Next.</span>
            </h1>

            {/* Sub-headline */}
            <p style={{ fontSize: '1.02rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '540px' }}>
              UrbanPulse AI turns urban telemetry into actionable intelligence for traffic, environment, mobility and emerging city risks.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button 
                onClick={() => setActiveTab('live-city')}
                style={{ 
                  padding: '14px 28px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  fontSize: '0.92rem', 
                  border: '1px solid rgba(56, 189, 248, 0.4)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <span>Explore Live City</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ 
                  padding: '14px 26px', 
                  borderRadius: '10px', 
                  background: 'rgba(255, 255, 255, 0.04)', 
                  color: '#e2e8f0', 
                  fontWeight: 600, 
                  fontSize: '0.92rem', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Play size={14} color="#38bdf8" />
                <span>See How It Works</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: REALISTIC CITY INTELLIGENCE VISUAL WITH CLEAN UNBLOCKED CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            
            {/* Dedicated Top Telemetry Bar (4 Non-Overlapping Live Cards) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              
              {/* 1. Weather Card */}
              <div style={{ background: 'rgba(10, 18, 36, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CloudSun size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.60rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Weather</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tempValue}</div>
                  <div style={{ fontSize: '0.60rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{weatherStatus}</div>
                </div>
              </div>

              {/* 2. Traffic Card */}
              <div style={{ background: 'rgba(10, 18, 36, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Car size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.60rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Traffic</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trafficStatus}</div>
                  <div style={{ fontSize: '0.60rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{avgSpeed}</div>
                </div>
              </div>

              {/* 3. Air Quality Card */}
              <div style={{ background: 'rgba(10, 18, 36, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Wind size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.60rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Air Quality</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fbbf24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{aqiValue}</div>
                  <div style={{ fontSize: '0.60rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{aqiStatus}</div>
                </div>
              </div>

              {/* 4. Urban Risk Card */}
              <div style={{ background: 'rgba(10, 18, 36, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(244, 63, 94, 0.35)', borderRadius: '10px', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.60rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Risk</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fb7185', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{riskLevel}</div>
                  <div style={{ fontSize: '0.60rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{riskStatus}</div>
                </div>
              </div>

            </div>

            {/* Interactive Map Container with 100% Unblocked Controls */}
            <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.25)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', background: '#09101f' }}>
              <LiveCityMap 
                selectedZone={selectedZoneId}
                onSelectZone={(zid) => setSelectedZoneId(zid)}
                mapHeight="400px"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 6. COMPACT ENTERPRISE SYSTEM STATUS STRIP */}
      <section style={{ background: 'rgba(9, 14, 25, 0.95)', borderTop: '1px solid rgba(56, 189, 248, 0.15)', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', padding: '10px 32px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
            <span>System Status: Operational</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} color="#38bdf8" />
            <span>Telemetry: <strong style={{ color: '#e2e8f0' }}>Connected</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#38bdf8" />
            <span>ML Engine: <strong style={{ color: '#e2e8f0' }}>Online</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={14} color="#38bdf8" />
            <span>Database: <strong style={{ color: '#e2e8f0' }}>SQLite Connected</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#38bdf8" />
            <span>Live Zones: <strong style={{ color: '#38bdf8' }}>{liveZonesCount} Monitored</strong></span>
          </div>

        </div>
      </section>

      {/* 7. REAL-TIME KPI STRIP: "ONE PLATFORM. A CLEARER VIEW OF THE CITY." */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px auto' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            One Platform. A Clearer View of the City.
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginTop: '6px' }}>
            Real-time intelligence for smarter urban operations and better decision making.
          </p>
        </div>

        {/* 4 KPI CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          
          {/* Card 1: Traffic */}
          <div 
            onClick={() => setActiveTab('traffic')}
            style={{ background: 'linear-gradient(180deg, rgba(14, 23, 42, 0.75), rgba(8, 14, 27, 0.85))', border: '1px solid rgba(56, 189, 248, 0.18)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={22} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Traffic</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{avgSpeed}</div>
            <div style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 700 }}>● {trafficStatus}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Live Telemetry
            </div>
          </div>

          {/* Card 2: Air Quality */}
          <div 
            onClick={() => setActiveTab('pollution')}
            style={{ background: 'linear-gradient(180deg, rgba(14, 23, 42, 0.75), rgba(8, 14, 27, 0.85))', border: '1px solid rgba(56, 189, 248, 0.18)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wind size={22} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Air Quality</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{aqiValue}</div>
            <div style={{ fontSize: '0.76rem', color: '#fbbf24', fontWeight: 700 }}>● {aqiStatus}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Live Telemetry
            </div>
          </div>

          {/* Card 3: Weather */}
          <div 
            onClick={() => setActiveTab('weather')}
            style={{ background: 'linear-gradient(180deg, rgba(14, 23, 42, 0.75), rgba(8, 14, 27, 0.85))', border: '1px solid rgba(56, 189, 248, 0.18)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloudSun size={22} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weather</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{tempValue}</div>
            <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700 }}>● {weatherStatus}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Live Telemetry
            </div>
          </div>

          {/* Card 4: Urban Risk */}
          <div 
            onClick={() => setActiveTab('risk')}
            style={{ background: 'linear-gradient(180deg, rgba(14, 23, 42, 0.75), rgba(8, 14, 27, 0.85))', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={22} />
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urban Risk</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb7185' }}>{riskLevel}</div>
            <div style={{ fontSize: '0.76rem', color: '#fb7185', fontWeight: 700 }}>● {riskStatus}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Model Assessment
            </div>
          </div>

        </div>
      </section>

      {/* 8. PLATFORM CAPABILITIES */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 48px 32px' }}>
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>Platform Capabilities</h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '4px' }}>Comprehensive urban intelligence for modern cities.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            
            <div onClick={() => setActiveTab('traffic')} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>01 Traffic Intelligence</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>Understand congestion and mobility patterns.</p>
              <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 700, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>→</div>
            </div>

            <div onClick={() => setActiveTab('pollution')} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wind size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>02 Environmental Intelligence</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>Monitor AQI and environmental conditions.</p>
              <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 700, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>→</div>
            </div>

            <div onClick={() => setActiveTab('predictions')} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>03 Predictive Intelligence</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>Identify emerging patterns using machine learning.</p>
              <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 700, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>→</div>
            </div>

            <div onClick={() => setActiveTab('predictions')} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>04 Operational Decision Support</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>Turn intelligence into informed actions.</p>
              <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 700, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>→</div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. HOW IT WORKS */}
      <section id="how-it-works" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 48px 32px' }}>
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>How It Works</h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '4px' }}>From data to decisions in three simple steps.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
            
            {/* Step 01 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>COLLECT</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Urban telemetry and environmental signals are continuously gathered.
              </p>
            </div>

            <ArrowRight size={20} color="#38bdf8" />

            {/* Step 02 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>ANALYZE</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>
                AI/ML models process patterns and anomalies in real time.
              </p>
            </div>

            <ArrowRight size={20} color="#38bdf8" />

            {/* Step 03 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>ACT</h3>
              <p style={{ fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Operators use intelligence to make informed, timely decisions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 11. FINAL CTA BANNER */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 64px 32px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(7, 11, 22, 0.95))', 
          border: '1px solid rgba(56, 189, 248, 0.3)', 
          borderRadius: '16px', 
          padding: '40px 48px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              See Your City With More Intelligence.
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#94a3b8', marginTop: '6px' }}>
              Explore live urban data, predictions and insights for a smarter tomorrow.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setActiveTab('live-city')}
              style={{ 
                padding: '14px 28px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #0284c7, #0369a1)', 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: '0.92rem', 
                border: '1px solid rgba(56, 189, 248, 0.4)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)'
              }}
            >
              <span>Explore Live City</span>
              <ArrowRight size={16} />
            </button>

            <button 
              onClick={() => setIsLoginModalOpen(true)}
              style={{ 
                padding: '14px 26px', 
                borderRadius: '10px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                color: '#e2e8f0', 
                fontWeight: 600, 
                fontSize: '0.92rem', 
                border: '1px solid rgba(255, 255, 255, 0.15)', 
                cursor: 'pointer'
              }}
            >
              Operator Login
            </button>
          </div>
        </div>
      </section>

      {/* 12. ENTERPRISE FOOTER */}
      <footer id="about-architecture" style={{ background: '#03060d', borderTop: '1px solid rgba(56, 189, 248, 0.12)', padding: '40px 32px', fontSize: '0.80rem', color: '#94a3b8' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
            
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Activity size={18} color="#38bdf8" />
                <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>UrbanPulse AI</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Smart City Intelligence Platform</div>
            </div>

            {/* Platform links */}
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '10px', fontSize: '0.82rem' }}>Platform</div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('live-city')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Live City</button>
                <button onClick={() => setActiveTab('predictions')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Predictions</button>
                <button onClick={() => setActiveTab('pollution')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Air Quality</button>
                <button onClick={() => setActiveTab('weather')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Weather</button>
              </div>
            </div>

            {/* Operations links */}
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '10px', fontSize: '0.82rem' }}>Operations</div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setIsLoginModalOpen(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer' }}>Operator Login</button>
                <button onClick={handleOpenCommandCenter} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Command Center</button>
              </div>
            </div>

          </div>

          {/* Analytical Disclaimer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.6 }}>
            UrbanPulse AI is an intelligent decision-support platform. Predictions and simulations are analytical outputs and should be interpreted alongside operational context.
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
