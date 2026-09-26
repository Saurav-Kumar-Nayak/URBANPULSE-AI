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
  Server,
  Sparkles
} from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import LiveCityMap from '../components/LiveCityMap';
import { api } from '../services/api';
import BrandLogo3D from '../components/ui/BrandLogo3D';

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

  // City Pulse Awakening Cinematic State
  const [awakeningStage, setAwakeningStage] = useState(() => {
    return sessionStorage.getItem('urbanpulse_awakened') ? 3 : 0;
  });

  // Live AI Insight Ticker index
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const defaultLiveInsights = [
    "Traffic flow is stable across monitored zones.",
    "Urban activity is increasing in the central district.",
    "Air quality conditions are expected to remain moderate.",
    "Emergency corridors active with green-wave traffic telemetry.",
    "IoT sensor nodes operating at 99.8% municipal network health."
  ];

  const activeInsightsList = insightsData.length > 0
    ? insightsData.map(i => i.title || i.summary || (typeof i === 'string' ? i : "Live zone telemetry synchronized."))
    : defaultLiveInsights;

  // City Pulse Awakening Timer State Machine
  useEffect(() => {
    if (awakeningStage >= 3) return;

    const t1 = setTimeout(() => {
      setAwakeningStage(1);
    }, 700);

    const t2 = setTimeout(() => {
      setAwakeningStage(2);
    }, 1500);

    const t3 = setTimeout(() => {
      setAwakeningStage(3);
      sessionStorage.setItem('urbanpulse_awakened', 'true');
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [awakeningStage]);

  // Rotate Live AI Insights every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInsightIndex(prev => (prev + 1) % activeInsightsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeInsightsList.length]);

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
    <div style={{ width: '100%', minHeight: '100vh', background: '#050914', color: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', position: 'relative' }}>
      
      {/* 0. CITY PULSE AWAKENING CINEMATIC LOAD OVERLAY */}
      {awakeningStage < 3 && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#050914',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: awakeningStage === 2 ? 0 : 1,
            pointerEvents: awakeningStage === 2 ? 'none' : 'auto'
          }}
        >
          {/* Ambient Glow Backdrop */}
          <div 
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(3, 105, 161, 0.03) 50%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Central Telemetry 3D Brand Logo & Status */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <BrandLogo3D size="lg" showSubtitle={true} showPulseLine={true} />

            {/* AI Signal Connection Pill */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 16px', borderRadius: '20px' }}>
                <Radio size={13} color="#38bdf8" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em' }}>
                  {awakeningStage === 0 ? "CONNECTING TO URBAN SIGNALS..." : "URBAN SIGNAL ESTABLISHED • INITIALIZING AI GIS SENSORS"}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '220px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: awakeningStage === 0 ? '45%' : '100%', 
                    background: 'linear-gradient(90deg, #0284c7, #38bdf8)', 
                    transition: 'width 0.8s ease-in-out',
                    borderRadius: '2px'
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Quick Skip Intro Option */}
          <button
            onClick={() => setAwakeningStage(3)}
            style={{
              position: 'absolute',
              bottom: '32px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94a3b8',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Skip Sequence →
          </button>
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
            
            {/* LIVE AI INSIGHT ROTATOR BANNER */}
            <div 
              style={{ 
                background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.12), rgba(15, 23, 42, 0.85))', 
                border: '1px solid rgba(56, 189, 248, 0.28)', 
                borderRadius: '10px', 
                padding: '8px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                fontSize: '0.78rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.66rem', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0, border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                  <Sparkles size={12} color="#38bdf8" />
                  <span>LIVE AI INSIGHT</span>
                </div>
                <div key={currentInsightIndex} style={{ color: '#f8fafc', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', animation: 'awakeningFadeIn 0.5s ease' }}>
                  "{activeInsightsList[currentInsightIndex]}"
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.64rem', color: '#94a3b8', flexShrink: 0 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                <span>REAL-TIME MONITORING</span>
              </div>
            </div>

            {/* Dedicated Top Telemetry Bar (4 Scoped Photographic Live Cards) */}
            <div className="urbanpulse-home-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              
              {/* 1. Weather Card */}
              <div className="card-photo-base card-photo-weather" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                  <CloudSun size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Weather</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{tempValue}</div>
                  <div style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">● {weatherStatus}</div>
                </div>
              </div>

              {/* 2. Traffic Card */}
              <div className="card-photo-base card-photo-traffic" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.22)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                  <Car size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Traffic</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{trafficStatus}</div>
                  <div style={{ fontSize: '0.62rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{avgSpeed}</div>
                </div>
              </div>

              {/* 3. Air Quality Card */}
              <div className="card-photo-base card-photo-aqi" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.22)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                  <Wind size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Air Quality</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fbbf24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{aqiValue}</div>
                  <div style={{ fontSize: '0.62rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{aqiStatus}</div>
                </div>
              </div>

              {/* 4. Urban Risk Card */}
              <div className="card-photo-base card-photo-risk" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.22)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
                  <AlertTriangle size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Risk</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fb7185', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{riskLevel}</div>
                  <div style={{ fontSize: '0.62rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-razor-sharp">{riskStatus}</div>
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
        <div className="urbanpulse-home-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          
          {/* Card 1: Traffic */}
          <div 
            onClick={() => setActiveTab('traffic')}
            className="card-photo-base card-photo-traffic"
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.22)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.5)', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                <Car size={22} />
              </div>
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#34d399', background: 'rgba(52, 211, 153, 0.18)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.04em' }}>
                MOBILITY
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Traffic Mobility</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '4px 0' }} className="text-razor-sharp">{avgSpeed}</div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }} className="text-razor-sharp">● {trafficStatus}</div>
            </div>

            {/* Sparkline Visual */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.70rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="text-razor-sharp">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                <span>LIVE TELEMETRY</span>
              </div>
              <svg width="60" height="18" viewBox="0 0 60 18" fill="none">
                <path d="M0 12 Q 15 4, 30 14 T 60 6" stroke="#34d399" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

          {/* Card 2: Air Quality */}
          <div 
            onClick={() => setActiveTab('pollution')}
            className="card-photo-base card-photo-aqi"
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.22)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.5)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                <Wind size={22} />
              </div>
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.18)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.04em' }}>
                ENVIRONMENT
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Air Quality Index</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '4px 0' }} className="text-razor-sharp">{aqiValue}</div>
              <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }} className="text-razor-sharp">● {aqiStatus}</div>
            </div>

            {/* Sparkline Visual */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.70rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="text-razor-sharp">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }} />
                <span>LIVE SENSOR DATA</span>
              </div>
              <svg width="60" height="18" viewBox="0 0 60 18" fill="none">
                <path d="M0 8 Q 15 14, 30 6 T 60 10" stroke="#fbbf24" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

          {/* Card 3: Weather */}
          <div 
            onClick={() => setActiveTab('weather')}
            className="card-photo-base card-photo-weather"
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.5)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                <CloudSun size={22} />
              </div>
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.04em' }}>
                ATMOSPHERE
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Weather Telemetry</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '4px 0' }} className="text-razor-sharp">{tempValue}</div>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }} className="text-razor-sharp">● {weatherStatus}</div>
            </div>

            {/* Sparkline Visual */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.70rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="text-razor-sharp">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                <span>METEOROLOGICAL SENSORS</span>
              </div>
              <svg width="60" height="18" viewBox="0 0 60 18" fill="none">
                <path d="M0 6 Q 15 12, 30 4 T 60 8" stroke="#38bdf8" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

          {/* Card 4: Urban Risk */}
          <div 
            onClick={() => setActiveTab('risk')}
            className="card-photo-base card-photo-risk"
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.22)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.5)', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
                <ShieldAlert size={22} />
              </div>
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#fb7185', background: 'rgba(244, 63, 94, 0.18)', border: '1px solid rgba(244, 63, 94, 0.4)', padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.04em' }}>
                AI MODEL
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em' }} className="text-razor-sharp">Urban Risk Assessment</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fb7185', letterSpacing: '-0.02em', margin: '4px 0' }} className="text-razor-sharp">{riskLevel}</div>
              <div style={{ fontSize: '0.78rem', color: '#fb7185', fontWeight: 700 }} className="text-razor-sharp">● {riskStatus}</div>
            </div>

            {/* Sparkline Visual */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.70rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="text-razor-sharp">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fb7185' }} />
                <span>MODEL PREDICTION</span>
              </div>
              <svg width="60" height="18" viewBox="0 0 60 18" fill="none">
                <path d="M0 14 Q 15 2, 30 10 T 60 4" stroke="#fb7185" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* 8. PLATFORM CAPABILITIES */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 48px 32px' }}>
        <div className="urbanpulse-home-cards">
          <div className="card-photo-base card-photo-weather" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(56, 189, 248, 0.18)', padding: '4px 12px', borderRadius: '20px', marginBottom: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <Layers size={13} />
                <span>CORE ARCHITECTURE</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }} className="text-razor-sharp">Platform Capabilities</h2>
              <p style={{ fontSize: '0.90rem', color: '#cbd5e1', marginTop: '4px' }} className="text-razor-sharp">Comprehensive 3D-assisted urban intelligence for modern municipal centers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '22px' }}>
              
              {/* Capability 1 */}
              <div onClick={() => setActiveTab('traffic')} className="card-photo-base card-photo-traffic" style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    <Car size={22} />
                  </div>
                  <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }} className="text-razor-sharp">MODULE 01</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">Traffic Intelligence</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }} className="text-razor-sharp">Real-time congestion telemetry, speed vectors & arterial corridor optimization.</p>
                <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }} className="text-razor-sharp">
                  <span>Explore Module</span>
                  <span>→</span>
                </div>
              </div>

              {/* Capability 2 */}
              <div onClick={() => setActiveTab('pollution')} className="card-photo-base card-photo-aqi" style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.22)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                    <Wind size={22} />
                  </div>
                  <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em' }} className="text-razor-sharp">MODULE 02</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">Environmental Intelligence</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }} className="text-razor-sharp">Multi-zone AQI monitoring, particulate tracking & emission heatmap telemetry.</p>
                <div style={{ color: '#fbbf24', fontSize: '0.88rem', fontWeight: 800, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }} className="text-razor-sharp">
                  <span>Explore Module</span>
                  <span>→</span>
                </div>
              </div>

              {/* Capability 3 */}
              <div onClick={() => setActiveTab('predictions')} className="card-photo-base card-photo-weather" style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    <Cpu size={22} />
                  </div>
                  <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }} className="text-razor-sharp">MODULE 03</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">Predictive Intelligence</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }} className="text-razor-sharp">AI-driven trend forecasting, incident prediction & anomaly classification.</p>
                <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }} className="text-razor-sharp">
                  <span>Explore Studio</span>
                  <span>→</span>
                </div>
              </div>

              {/* Capability 4 */}
              <div onClick={() => setActiveTab('predictions')} className="card-photo-base card-photo-ops" style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    <Activity size={22} />
                  </div>
                  <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }} className="text-razor-sharp">MODULE 04</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">Operational Decision Support</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }} className="text-razor-sharp">Actionable dispatch protocols, green-wave signal control & incident triage.</p>
                <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }} className="text-razor-sharp">
                  <span>View Command</span>
                  <span>→</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 9. HOW IT WORKS OPERATIONAL WORKFLOW */}
      <section id="how-it-works" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 48px 32px' }}>
        <div className="urbanpulse-home-cards">
          <div className="card-photo-base card-photo-weather" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(56, 189, 248, 0.18)', padding: '4px 12px', borderRadius: '20px', marginBottom: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <Database size={13} />
                <span>OPERATIONAL PIPELINE</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }} className="text-razor-sharp">How UrbanPulse AI Works</h2>
              <p style={{ fontSize: '0.90rem', color: '#cbd5e1', marginTop: '4px' }} className="text-razor-sharp">From raw telemetry signals to coordinated municipal decision making.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
              
              {/* Step 01 */}
              <div className="card-photo-base card-photo-traffic" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.92rem', boxShadow: '0 6px 16px rgba(2, 132, 199, 0.5)' }}>
                    01
                  </div>
                  <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.18)', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    TELEMETRY
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">COLLECT</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }} className="text-razor-sharp">
                  IoT sensors, traffic cameras, weather beacons and municipal GPS streams are continuously aggregated into the data engine.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <ArrowRight size={24} color="#38bdf8" />
                <span style={{ fontSize: '0.60rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>DATA</span>
              </div>

              {/* Step 02 */}
              <div className="card-photo-base card-photo-weather" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.92rem', boxShadow: '0 6px 16px rgba(2, 132, 199, 0.5)' }}>
                    02
                  </div>
                  <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#c084fc', background: 'rgba(139, 92, 246, 0.18)', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    AI / ML ENGINE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">ANALYZE</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }} className="text-razor-sharp">
                  Machine learning models process patterns, evaluate risk scores and detect traffic anomalies in real time.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <ArrowRight size={24} color="#38bdf8" />
                <span style={{ fontSize: '0.60rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>INSIGHT</span>
              </div>

              {/* Step 03 */}
              <div className="card-photo-base card-photo-ops" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.92rem', boxShadow: '0 6px 16px rgba(2, 132, 199, 0.5)' }}>
                    03
                  </div>
                  <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#34d399', background: 'rgba(16, 185, 129, 0.18)', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    DECISION
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }} className="text-razor-sharp">ACT</h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }} className="text-razor-sharp">
                  Command center operators receive AI decision recommendations to dispatch resources and optimize city flow.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 11. FINAL REAL-WORLD PHOTOGRAPHIC CTA COMMAND PANEL */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 64px 32px' }}>
        <div className="urbanpulse-home-cards">
          <div className="card-photo-base card-photo-cta" style={{ padding: '44px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '28px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(56, 189, 248, 0.2)', padding: '4px 14px', borderRadius: '20px', marginBottom: '12px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                <Compass size={14} color="#38bdf8" />
                <span>COMMAND CENTER INTELLIGENCE</span>
              </div>
              <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }} className="text-razor-sharp">
                See Your City With More Intelligence.
              </h2>
              <p style={{ fontSize: '1.02rem', color: '#cbd5e1', marginTop: '8px', maxWidth: '580px', lineHeight: 1.6 }} className="text-razor-sharp">
                Explore live municipal data streams, predictive AI models, and real-time risk assessments for a smarter tomorrow.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <button 
                onClick={() => setActiveTab('live-city')}
                className="btn-primary btn-3d"
                style={{ 
                  padding: '16px 32px', 
                  fontSize: '0.96rem',
                  boxShadow: '0 8px 25px rgba(2, 132, 199, 0.5)'
                }}
              >
                <span>Explore Live City</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="btn-subtle"
                style={{ 
                  padding: '16px 28px', 
                  fontSize: '0.96rem'
                }}
              >
                <Lock size={16} color="#38bdf8" />
                <span>Operator Login</span>
              </button>
            </div>
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

            {/* Account links */}
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '10px', fontSize: '0.82rem' }}>Account</div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('login')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer' }}>Login</button>
                <button onClick={() => setActiveTab('signup')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Sign Up</button>
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
