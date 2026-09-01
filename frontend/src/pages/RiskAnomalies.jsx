import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  Sliders, 
  Shield, 
  Activity, 
  BrainCircuit, 
  CloudRain, 
  Factory, 
  Car, 
  Wind,
  Users,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';

const RISK_TREND_DATA = [
  { time: '18:00', high: 45, medium: 30, low: 15 },
  { time: '19:00', high: 58, medium: 38, low: 18 },
  { time: '20:00', high: 72, medium: 48, low: 22 },
  { time: '21:00', high: 68, medium: 52, low: 25 },
  { time: '22:00', high: 75, medium: 55, low: 28 },
  { time: '23:00', high: 70, medium: 50, low: 24 }
];

export const RiskAnomalies = () => {
  const { setActiveTab, openCopilotWithQuery } = useUrbanPulseContext();
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [simulatingScenario, setSimulatingScenario] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [anomRes, locRes] = await Promise.all([
        api.getAnomalies(),
        api.getLocations()
      ]);
      setAnomaliesData(anomRes);
      setLocations(locRes || []);
    } catch (e) {
      console.error("Error fetching risk data:", e);
      setError('Unable to fetch risk telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunSimulation = async (scenarioType) => {
    setSimulatingScenario(scenarioType);
    setSimulationResult(null);
    try {
      let payload = {
        traffic_density: 320,
        congestion_index: 0.85,
        avg_speed_kmh: 12.5,
        aqi: 165,
        pm25: 78.0,
        risk_score: 82.0
      };

      if (scenarioType === 'weather') {
        payload = { traffic_density: 390, congestion_index: 0.95, avg_speed_kmh: 8.0, aqi: 140, pm25: 65.0, risk_score: 91.0 };
      } else if (scenarioType === 'industrial') {
        payload = { traffic_density: 220, congestion_index: 0.60, avg_speed_kmh: 22.0, aqi: 360, pm25: 185.0, risk_score: 95.0 };
      } else if (scenarioType === 'gridlock') {
        payload = { traffic_density: 450, congestion_index: 0.98, avg_speed_kmh: 5.0, aqi: 180, pm25: 90.0, risk_score: 92.0 };
      }

      const res = await api.detectAnomaly(payload);
      setSimulationResult({
        scenario: scenarioType,
        detection: res.detection
      });
      await fetchData();
    } catch (e) {
      console.error("Simulator execution error:", e);
    } finally {
      setSimulatingScenario(null);
    }
  };

  if (loading) return <PageContainer><LoadingSpinner label="Loading Risk Intelligence Command Center..." /></PageContainer>;
  if (error) return <PageContainer><EmptyState title="Risk Intelligence Telemetry Error" message={error} onRetry={fetchData} /></PageContainer>;

  const recentAnomalies = anomaliesData?.recent_anomalies || [];
  
  // Filtered Anomalies
  const filteredAnomalies = recentAnomalies.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Air Quality Risk') return item.anomaly_type?.includes('Air') || item.anomaly_type?.includes('Pollution') || item.aqi > 150;
    if (activeCategory === 'Traffic Risk') return item.anomaly_type?.includes('Traffic') || item.anomaly_type?.includes('Gridlock') || item.anomaly_type?.includes('Bottleneck');
    if (activeCategory === 'Multi-Hazard') return item.anomaly_type?.includes('Multi') || item.risk_score >= 60;
    return true;
  });

  return (
    <PageContainer>
      <style>{`
        .enterprise-card {
          background: #0B1730;
          border: 1px solid rgba(120, 170, 255, 0.18);
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .enterprise-card:hover {
          border-color: rgba(32, 217, 255, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.45);
        }
        .btn-analyze-primary {
          background: linear-gradient(135deg, #1EA7FF 0%, #0284c7 100%);
          border: none;
          color: #ffffff;
          font-weight: 800;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.76rem;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(30, 167, 255, 0.3);
        }
        .btn-analyze-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .btn-map-secondary {
          background: #101E3A;
          border: 1px solid rgba(120, 170, 255, 0.2);
          color: #F5F8FF;
          font-weight: 700;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.76rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s ease;
        }
        .btn-map-secondary:hover {
          background: #16284D;
          border-color: rgba(32, 217, 255, 0.3);
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#050B18', minHeight: '100vh', paddingBottom: '30px' }}>
        
        {/* 1. PAGE HEADER + ENTERPRISE KPI STRIP */}
        <div style={{
          background: '#0B1730',
          border: '1px solid rgba(120, 170, 255, 0.18)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
        }}>
          {/* Header Title & Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'rgba(32, 217, 255, 0.12)', 
              border: '1px solid rgba(32, 217, 255, 0.35)', 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center',
              boxShadow: '0 0 16px rgba(32, 217, 255, 0.2)'
            }}>
              <Shield size={24} color="#20D9FF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F5F8FF', margin: 0, letterSpacing: '-0.02em' }}>
                  Risk Intelligence
                </h1>
                <span style={{
                  background: 'rgba(32, 217, 255, 0.12)',
                  border: '1px solid rgba(32, 217, 255, 0.3)',
                  color: '#20D9FF',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  letterSpacing: '0.04em'
                }}>
                  REAL-TIME RISK ENGINE
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#91A4C5', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                Proactive multi-hazard risk assessment, predictive anomaly detection, and automated dispatch advisories.
              </p>
            </div>
          </div>

          {/* 4 Enterprise KPI Metrics */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Active Alerts */}
            <div style={{
              background: '#101E3A',
              border: '1px solid rgba(120, 170, 255, 0.18)',
              borderRadius: '12px',
              padding: '12px 18px',
              minWidth: '130px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Alerts
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#F5F8FF', marginTop: '2px', lineHeight: 1 }}>
                12
              </div>
              <div style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ArrowDownRight size={12} /> 18% vs. last hour
              </div>
            </div>

            {/* Risk Zones */}
            <div style={{
              background: '#101E3A',
              border: '1px solid rgba(120, 170, 255, 0.18)',
              borderRadius: '12px',
              padding: '12px 18px',
              minWidth: '130px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Risk Zones
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#F5F8FF', marginTop: '2px', lineHeight: 1 }}>
                4
              </div>
              <div style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ArrowDownRight size={12} /> 20% vs. last hour
              </div>
            </div>

            {/* City Coverage */}
            <div style={{
              background: '#101E3A',
              border: '1px solid rgba(120, 170, 255, 0.18)',
              borderRadius: '12px',
              padding: '12px 18px',
              minWidth: '130px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                City Coverage
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#20D9FF', marginTop: '2px', lineHeight: 1 }}>
                98%
              </div>
              <div style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ArrowUpRight size={12} /> 2% vs. last hour
              </div>
            </div>

            {/* AI Accuracy */}
            <div style={{
              background: '#101E3A',
              border: '1px solid rgba(120, 170, 255, 0.18)',
              borderRadius: '12px',
              padding: '12px 18px',
              minWidth: '130px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Accuracy
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#7C5CFF', marginTop: '2px', lineHeight: 1 }}>
                94.2%
              </div>
              <div style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ArrowUpRight size={12} /> 1.1% vs. last hour
              </div>
            </div>
          </div>
        </div>

        {/* 2. RISK CATEGORY FILTER CONTROL TABS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'Air Quality Risk', label: 'Air Quality Risk', icon: Wind },
              { id: 'Traffic Risk', label: 'Traffic Risk', icon: Car },
              { id: 'Multi-Hazard', label: 'Multi-Hazard', icon: AlertTriangle },
              { id: 'Infrastructure', label: 'Infrastructure', icon: Sliders },
              { id: 'Public Safety', label: 'Public Safety', icon: Shield },
              { id: 'Environmental', label: 'Environmental', icon: Activity }
            ].map(cat => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? 'All' : cat.id)}
                  style={{
                    background: isActive ? 'rgba(30, 167, 255, 0.18)' : '#0B1730',
                    border: isActive ? '1px solid rgba(32, 217, 255, 0.45)' : '1px solid rgba(120, 170, 255, 0.18)',
                    borderRadius: '10px',
                    color: isActive ? '#20D9FF' : '#91A4C5',
                    padding: '8px 16px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconComp size={15} color={isActive ? '#20D9FF' : '#91A4C5'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            style={{
              background: '#0B1730',
              border: '1px solid rgba(120, 170, 255, 0.2)',
              borderRadius: '10px',
              color: '#91A4C5',
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings size={15} />
            <span>System Settings</span>
          </button>
        </div>

        {/* 3. MAIN RISK INTELLIGENCE GRID (3 COLUMNS) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          
          {/* COLUMN 1: AIR QUALITY HAZARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Risk Card 1: Air Quality Hazard - Saheed Nagar */}
            <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #FF5A67' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF5A67', fontWeight: 900, fontSize: '0.94rem' }}>
                    <AlertTriangle size={17} />
                    <span>Air Quality Hazard</span>
                  </div>
                  <span style={{
                    background: 'rgba(255, 90, 103, 0.15)',
                    border: '1px solid #FF5A67',
                    color: '#FF5A67',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    HIGH RISK
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#F5F8FF', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#20D9FF" />
                      <span>Saheed Nagar</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#91A4C5', marginTop: '6px', lineHeight: 1.45, margin: '6px 0 0 0' }}>
                      AQI levels significantly above safe limits detected in high-density traffic corridor.
                    </p>
                    <div style={{ fontSize: '0.66rem', color: '#FF5A67', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowUpRight size={12} /> 14% vs. 1h peak
                    </div>
                  </div>

                  {/* Clean Circular AQI Gauge */}
                  <div style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: '50%', 
                    border: '3px solid #FF5A67', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justify: 'center',
                    background: 'rgba(255, 90, 103, 0.1)',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '0.58rem', color: '#91A4C5', fontWeight: 700 }}>AQI</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F5F8FF', lineHeight: 1 }}>356</div>
                    <div style={{ fontSize: '0.52rem', color: '#FF5A67', fontWeight: 800, marginTop: '1px' }}>Hazardous</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(120, 170, 255, 0.12)' }}>
                <button 
                  onClick={() => setActiveTab('live-city')}
                  className="btn-map-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MapPin size={14} /> View on Map
                </button>
                <button 
                  onClick={() => openCopilotWithQuery('Analyze air quality hazard in Saheed Nagar')}
                  className="btn-analyze-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <BrainCircuit size={14} /> Analyze Risk
                </button>
              </div>
            </div>

            {/* Risk Card 2: Air Quality Hazard - Railway Station */}
            <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #FF5A67' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF5A67', fontWeight: 900, fontSize: '0.94rem' }}>
                    <AlertTriangle size={17} />
                    <span>Air Quality Hazard</span>
                  </div>
                  <span style={{
                    background: 'rgba(255, 90, 103, 0.15)',
                    border: '1px solid #FF5A67',
                    color: '#FF5A67',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    HIGH RISK
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#F5F8FF', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#20D9FF" />
                      <span>Railway Station</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#91A4C5', marginTop: '6px', lineHeight: 1.45, margin: '6px 0 0 0' }}>
                      PM2.5 and PM10 particulate accumulation during peak evening train arrival hours.
                    </p>
                    <div style={{ fontSize: '0.66rem', color: '#FF5A67', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowUpRight size={12} /> 9% vs. 1h peak
                    </div>
                  </div>

                  {/* Clean Circular AQI Gauge */}
                  <div style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: '50%', 
                    border: '3px solid #FF5A67', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justify: 'center',
                    background: 'rgba(255, 90, 103, 0.1)',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '0.58rem', color: '#91A4C5', fontWeight: 700 }}>AQI</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F5F8FF', lineHeight: 1 }}>324</div>
                    <div style={{ fontSize: '0.52rem', color: '#FF5A67', fontWeight: 800, marginTop: '1px' }}>Hazardous</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(120, 170, 255, 0.12)' }}>
                <button 
                  onClick={() => setActiveTab('live-city')}
                  className="btn-map-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MapPin size={14} /> View on Map
                </button>
                <button 
                  onClick={() => openCopilotWithQuery('Analyze air quality hazard at Bhubaneswar Railway Station')}
                  className="btn-analyze-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <BrainCircuit size={14} /> Analyze Risk
                </button>
              </div>
            </div>

          </div>

          {/* COLUMN 2: MULTI-VECTOR / MULTI-HAZARD RISKS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Risk Card 1: Multi-Hazard Risk - Kalarahanga Road */}
            <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #FFB020' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', fontWeight: 900, fontSize: '0.94rem' }}>
                    <AlertTriangle size={17} />
                    <span>Multi-Hazard Risk</span>
                  </div>
                  <span style={{
                    background: 'rgba(255, 176, 32, 0.15)',
                    border: '1px solid #FFB020',
                    color: '#FFB020',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    MEDIUM RISK
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#F5F8FF', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#20D9FF" />
                      <span>Kalarahanga Road</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#91A4C5', marginTop: '6px', lineHeight: 1.45, margin: '6px 0 0 0' }}>
                      Combined risk from traffic bottleneck (48% congestion) and particulate pollution.
                    </p>
                    <div style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowDownRight size={12} /> 4% recovering
                    </div>
                  </div>

                  {/* Circular Arc Risk Meter */}
                  <div style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: '50%', 
                    border: '3px solid #FFB020', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justify: 'center',
                    background: 'rgba(255, 176, 32, 0.1)',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '0.58rem', color: '#91A4C5', fontWeight: 700 }}>RISK</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFB020', lineHeight: 1 }}>67%</div>
                    <div style={{ fontSize: '0.52rem', color: '#FFB020', fontWeight: 800, marginTop: '1px' }}>Moderate</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(120, 170, 255, 0.12)' }}>
                <button 
                  onClick={() => setActiveTab('live-city')}
                  className="btn-map-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MapPin size={14} /> View on Map
                </button>
                <button 
                  onClick={() => openCopilotWithQuery('Analyze multi-hazard risk on Kalarahanga Road')}
                  className="btn-analyze-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <BrainCircuit size={14} /> Analyze Risk
                </button>
              </div>
            </div>

            {/* Risk Card 2: Multi-Vector Risk - Saheed Nagar */}
            <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #FFB020' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFB020', fontWeight: 900, fontSize: '0.94rem' }}>
                    <AlertTriangle size={17} />
                    <span>Multi-Vector Risk</span>
                  </div>
                  <span style={{
                    background: 'rgba(255, 176, 32, 0.15)',
                    border: '1px solid #FFB020',
                    color: '#FFB020',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    MEDIUM RISK
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#F5F8FF', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#20D9FF" />
                      <span>Saheed Nagar</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#91A4C5', marginTop: '6px', lineHeight: 1.45, margin: '6px 0 0 0' }}>
                      Moderate risk due to traffic congestion (21%) and particulate pollution correlation.
                    </p>
                    <div style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowDownRight size={12} /> 6% recovering
                    </div>
                  </div>

                  {/* Circular Arc Risk Meter */}
                  <div style={{ 
                    width: '68px', 
                    height: '68px', 
                    borderRadius: '50%', 
                    border: '3px solid #FFB020', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justify: 'center',
                    background: 'rgba(255, 176, 32, 0.1)',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '0.58rem', color: '#91A4C5', fontWeight: 700 }}>RISK</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFB020', lineHeight: 1 }}>62%</div>
                    <div style={{ fontSize: '0.52rem', color: '#FFB020', fontWeight: 800, marginTop: '1px' }}>Moderate</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(120, 170, 255, 0.12)' }}>
                <button 
                  onClick={() => setActiveTab('live-city')}
                  className="btn-map-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MapPin size={14} /> View on Map
                </button>
                <button 
                  onClick={() => openCopilotWithQuery('Analyze multi-vector risk in Saheed Nagar')}
                  className="btn-analyze-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <BrainCircuit size={14} /> Analyze Risk
                </button>
              </div>
            </div>

          </div>

          {/* COLUMN 3: SYSTEM HEALTH + RISK TREND ANALYTICS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* System Health Card */}
            <div className="enterprise-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <CheckCircle2 size={18} color="#27D17F" />
                  <span style={{ fontSize: '0.94rem', fontWeight: 900, color: '#F5F8FF' }}>System Health</span>
                  <span style={{
                    background: 'rgba(39, 209, 127, 0.15)',
                    border: '1px solid #27D17F',
                    color: '#27D17F',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    OPTIMAL
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#91A4C5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#27D17F' }}>● Data Ingestion</span>
                    <strong style={{ color: '#F5F8FF', marginLeft: 'auto' }}>Active</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#27D17F' }}>● AI Models</span>
                    <strong style={{ color: '#F5F8FF', marginLeft: 'auto' }}>Operational</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#27D17F' }}>● Risk Engine</span>
                    <strong style={{ color: '#F5F8FF', marginLeft: 'auto' }}>Running</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#27D17F' }}>● Alerts System</span>
                    <strong style={{ color: '#F5F8FF', marginLeft: 'auto' }}>Active</strong>
                  </div>
                </div>
              </div>

              {/* Health Donut Gauge */}
              <div style={{ 
                width: '68px', 
                height: '68px', 
                borderRadius: '50%', 
                background: 'conic-gradient(#27D17F 0% 96%, #101E3A 96% 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#0B1730',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justify: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  color: '#27D17F'
                }}>
                  96%
                  <span style={{ fontSize: '0.50rem', color: '#91A4C5', fontWeight: 700 }}>Health</span>
                </div>
              </div>
            </div>

            {/* Risk Trend Analytics Card */}
            <div className="enterprise-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F5F8FF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} color="#20D9FF" />
                  <span>Risk Trend Analytics</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.66rem', fontWeight: 700 }}>
                  <span style={{ color: '#FF5A67' }}>● High</span>
                  <span style={{ color: '#FFB020' }}>● Med</span>
                  <span style={{ color: '#27D17F' }}>● Low</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
                <div style={{ height: '120px', flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={RISK_TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 170, 255, 0.1)" />
                      <XAxis dataKey="time" stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} />
                      <Area type="monotone" dataKey="high" stroke="#FF5A67" fill="rgba(255, 90, 103, 0.2)" strokeWidth={2} />
                      <Area type="monotone" dataKey="medium" stroke="#FFB020" fill="rgba(255, 176, 32, 0.2)" strokeWidth={2} />
                      <Area type="monotone" dataKey="low" stroke="#27D17F" fill="rgba(39, 209, 127, 0.2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{
                  background: '#101E3A',
                  border: '1px solid rgba(120, 170, 255, 0.18)',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  minWidth: '85px'
                }}>
                  <div style={{ fontSize: '0.6rem', color: '#91A4C5', fontWeight: 700 }}>Total Risk Zones</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFB020', marginTop: '2px' }}>4 / 12</div>
                  <div style={{ fontSize: '0.6rem', color: '#FF5A67', fontWeight: 800, marginTop: '4px' }}>▲ 1 vs. 1h ago</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4. BOTTOM SECTION: SIMULATOR (LEFT) + AI INSIGHTS (MIDDLE) + DATA CONFIDENCE (RIGHT) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Card 1: Development Anomaly Injection Simulator */}
          <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#20D9FF" />
                <h3 style={{ fontSize: '0.94rem', fontWeight: 900, color: '#F5F8FF', margin: 0 }}>
                  Anomaly Injection Simulator
                </h3>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#91A4C5', margin: '4px 0 0 0' }}>
                Simulate high-impact disaster & anomaly scenarios to test system resilience.
              </p>

              {/* 3 Scenario Action Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '14px' }}>
                {/* Weather */}
                <div style={{ background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.15)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <CloudRain size={18} color="#20D9FF" style={{ margin: '0 auto' }} />
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#F5F8FF', marginTop: '6px' }}>Weather Risk</div>
                  <div style={{ fontSize: '0.58rem', color: '#91A4C5', marginTop: '2px' }}>Storm & Rain</div>
                  <button 
                    onClick={() => handleRunSimulation('weather')}
                    disabled={simulatingScenario === 'weather'}
                    style={{ background: 'rgba(32, 217, 255, 0.18)', border: '1px solid rgba(32, 217, 255, 0.4)', color: '#20D9FF', borderRadius: '6px', padding: '5px 8px', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer', marginTop: '8px', width: '100%' }}
                  >
                    {simulatingScenario === 'weather' ? 'Simulating...' : '▶ Run'}
                  </button>
                </div>

                {/* Industrial */}
                <div style={{ background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.15)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <Factory size={18} color="#7C5CFF" style={{ margin: '0 auto' }} />
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#F5F8FF', marginTop: '6px' }}>Industrial Spike</div>
                  <div style={{ fontSize: '0.58rem', color: '#91A4C5', marginTop: '2px' }}>AQI Surge</div>
                  <button 
                    onClick={() => handleRunSimulation('industrial')}
                    disabled={simulatingScenario === 'industrial'}
                    style={{ background: 'rgba(124, 92, 255, 0.18)', border: '1px solid rgba(124, 92, 255, 0.4)', color: '#7C5CFF', borderRadius: '6px', padding: '5px 8px', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer', marginTop: '8px', width: '100%' }}
                  >
                    {simulatingScenario === 'industrial' ? 'Simulating...' : '▶ Run'}
                  </button>
                </div>

                {/* Gridlock */}
                <div style={{ background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.15)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <Car size={18} color="#27D17F" style={{ margin: '0 auto' }} />
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#F5F8FF', marginTop: '6px' }}>Gridlock</div>
                  <div style={{ fontSize: '0.58rem', color: '#91A4C5', marginTop: '2px' }}>Heavy Traffic</div>
                  <button 
                    onClick={() => handleRunSimulation('gridlock')}
                    disabled={simulatingScenario === 'gridlock'}
                    style={{ background: 'rgba(39, 209, 127, 0.18)', border: '1px solid rgba(39, 209, 127, 0.4)', color: '#27D17F', borderRadius: '6px', padding: '5px 8px', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer', marginTop: '8px', width: '100%' }}
                  >
                    {simulatingScenario === 'gridlock' ? 'Simulating...' : '▶ Run'}
                  </button>
                </div>
              </div>
            </div>

            {simulationResult && (
              <div style={{ background: 'rgba(255, 90, 103, 0.12)', border: '1px solid #FF5A67', color: '#FF5A67', padding: '8px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, marginTop: '10px' }}>
                <strong>Simulation Feedback:</strong> Anomaly score {simulationResult.detection?.decision_score} ({simulationResult.detection?.anomaly_type})
              </div>
            )}
          </div>

          {/* Card 2: AI Insights & Recommendations */}
          <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#F5F8FF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrainCircuit size={18} color="#20D9FF" />
                  <span>AI Insights & Advisories</span>
                </div>
                <span style={{
                  background: 'rgba(32, 217, 255, 0.12)',
                  border: '1px solid rgba(32, 217, 255, 0.3)',
                  color: '#20D9FF',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.62rem',
                  fontWeight: 800
                }}>
                  UrbanPulse AI
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Item 1 */}
                <div style={{ background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.12)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Wind size={16} color="#27D17F" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.74rem', color: '#91A4C5', lineHeight: 1.4 }}>
                      <strong style={{ color: '#F5F8FF' }}>Air Quality Alert:</strong> Deploy water sprinklers in high pollution zones (Saheed Nagar, Railway Station).
                    </div>
                  </div>
                  <span style={{ background: 'rgba(255, 90, 103, 0.15)', color: '#FF5A67', border: '1px solid #FF5A67', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 800, flexShrink: 0 }}>
                    HIGH
                  </span>
                </div>

                {/* Item 2 */}
                <div style={{ background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.12)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Car size={16} color="#20D9FF" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.74rem', color: '#91A4C5', lineHeight: 1.4 }}>
                      <strong style={{ color: '#F5F8FF' }}>Traffic Risk:</strong> Optimize signal timing on Kalarahanga Road and NH-16 for smoother flow.
                    </div>
                  </div>
                  <span style={{ background: 'rgba(255, 176, 32, 0.15)', color: '#FFB020', border: '1px solid #FFB020', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 800, flexShrink: 0 }}>
                    MED
                  </span>
                </div>

                {/* Item 3 */}
                <div style={{ background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.12)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={16} color="#7C5CFF" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.74rem', color: '#91A4C5', lineHeight: 1.4 }}>
                      <strong style={{ color: '#F5F8FF' }}>Public Safety:</strong> Issue public health advisories for vulnerable groups in AQI Hazard zones.
                    </div>
                  </div>
                  <span style={{ background: 'rgba(255, 90, 103, 0.15)', color: '#FF5A67', border: '1px solid #FF5A67', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 800, flexShrink: 0 }}>
                    HIGH
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Data Confidence */}
          <div className="enterprise-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#F5F8FF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#20D9FF" />
                <span>Data Confidence & Integrity</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}>
                {/* Donut Gauge */}
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'conic-gradient(#27D17F 0% 94%, #101E3A 94% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#0B1730',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    color: '#27D17F'
                  }}>
                    94%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#27D17F' }}>High Confidence</div>
                  <div style={{ fontSize: '0.7rem', color: '#91A4C5', marginTop: '2px', lineHeight: 1.3 }}>
                    Multi-source telemetry cross-validated with historical ML model baseline.
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(120, 170, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.7rem',
                color: '#91A4C5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#27D17F" /> Live Sensor Data (AQI, PM2.5, PM10)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#27D17F" /> Traffic Corridor Telemetry</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#27D17F" /> RainViewer Radar Feed</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#27D17F" /> Municipal Open Data Matrix</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageContainer>
  );
};

export default RiskAnomalies;
