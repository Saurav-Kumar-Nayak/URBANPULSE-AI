import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Dot
} from 'recharts';
import { 
  Sliders, 
  Play, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Users, 
  Car, 
  Wind, 
  Building2, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  CloudRain, 
  TrendingUp, 
  Activity, 
  Info, 
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  ChevronDown
} from 'lucide-react';
import { api } from '../../services/api';

const SCENARIO_TABS = [
  { id: 'traffic', label: 'Traffic Scenario', icon: Car },
  { id: 'air_quality', label: 'Air Quality', icon: Wind },
  { id: 'weather', label: 'Weather Impact', icon: CloudRain },
  { id: 'urban_growth', label: 'Urban Growth', icon: Building2 },
  { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert }
];

const PRECONFIGURED_PRESETS = [
  {
    id: 'storm',
    title: 'Severe Storm & Commute Surge',
    icon: '🌧',
    description: 'Simulates Heavy Rain weather combined with +35% traffic density along major arterial bridges.',
    impact: 'Traffic ▲ 35% | Delay +18m',
    risk: 'HIGH',
    color: '#fb7185',
    trafficVal: 35,
    aqiVal: 15,
    weatherVal: 'HIGH'
  },
  {
    id: 'emission',
    title: 'Industrial Emission Deterioration',
    icon: '🏭',
    description: 'Simulates +60% AQI spike in Saheed Nagar district with stagnant low wind speed.',
    impact: 'AQI ▲ 60% | Speed -12km/h',
    risk: 'MODERATE',
    color: '#fbbf24',
    trafficVal: 10,
    aqiVal: 60,
    weatherVal: 'MEDIUM'
  },
  {
    id: 'green_transit',
    title: 'Green Transit Diversion',
    icon: '🚌',
    description: 'Simulates -25% traffic reduction via electric bus prioritization during peak hours.',
    impact: 'Traffic ▼ 25% | AQI ▼ 15%',
    risk: 'LOW',
    color: '#34d399',
    trafficVal: -25,
    aqiVal: -15,
    weatherVal: 'LOW'
  }
];

export const WhatIfSimulatorWidget = () => {
  // Navigation & Selector State
  const [activeTab, setActiveTab] = useState('traffic');
  const [scenarioType, setScenarioType] = useState('Peak Hour Traffic');
  const [selectedZone, setSelectedZone] = useState('Saheed Nagar – Patia');
  const [selectedTime, setSelectedTime] = useState('6:00 – 9:00 PM');

  // Simulator Sliders
  const [trafficIncrease, setTrafficIncrease] = useState(20);
  const [aqiChange, setAqiChange] = useState(10);
  const [weatherSeverity, setWeatherSeverity] = useState('LOW');

  // Simulation Results & Loading
  const [simulating, setSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(true);
  
  const [results, setResults] = useState({
    predictedTraffic: '+18%',
    aqiImpact: '+7%',
    riskLevel: 'HIGH',
    expectedDelay: '+11 min'
  });

  // Dynamic Chart Data based on current trafficIncrease
  const chartData = useMemo(() => {
    const baseDensity = 40 + trafficIncrease * 0.5;
    return [
      { time: '6:00', density: Math.round(baseDensity * 0.5) },
      { time: '6:30', density: Math.round(baseDensity * 0.75) },
      { time: '7:00', density: Math.round(baseDensity * 0.6) },
      { time: '7:30', density: Math.round(baseDensity * 0.7) },
      { time: '8:00', density: Math.min(98, Math.round(baseDensity * 1.1)), isPeak: true },
      { time: '8:30', density: Math.round(baseDensity * 0.85) },
      { time: '9:00', density: Math.round(baseDensity * 0.65) }
    ];
  }, [trafficIncrease]);

  // Handle Main Run AI Simulation
  const handleRunSimulation = async () => {
    setSimulating(true);

    try {
      const payload = {
        target: 'risk',
        traffic_density: Math.round(140 * (1 + trafficIncrease / 100)),
        congestion_index: Math.min(0.98, 0.5 + trafficIncrease / 150),
        aqi: Math.round(75 * (1 + aqiChange / 100)),
        weather: weatherSeverity === 'HIGH' ? 'Heavy Rain' : (weatherSeverity === 'MEDIUM' ? 'Rain' : 'Clear'),
        temperature_c: 24,
        humidity_pct: weatherSeverity === 'HIGH' ? 88 : 55
      };

      const res = await api.predict(payload);

      const predT = `${trafficIncrease >= 0 ? '+' : ''}${Math.round(trafficIncrease * 0.88)}%`;
      const predAQI = `${aqiChange >= 0 ? '+' : ''}${Math.round(aqiChange * 0.75)}%`;
      const calculatedDelay = `${trafficIncrease >= 0 ? '+' : ''}${Math.max(1, Math.round((trafficIncrease / 10) * 4.5 + (weatherSeverity === 'HIGH' ? 8 : 2)))} min`;
      const risk = res.prediction_result?.predicted_risk_level?.toUpperCase() || (trafficIncrease > 30 || weatherSeverity === 'HIGH' ? 'HIGH' : (trafficIncrease > 10 ? 'MEDIUM' : 'LOW'));

      setResults({
        predictedTraffic: predT,
        aqiImpact: predAQI,
        riskLevel: risk,
        expectedDelay: calculatedDelay
      });
      setHasSimulated(true);
    } catch (e) {
      // Local fallback calculation
      const predT = `${trafficIncrease >= 0 ? '+' : ''}${Math.round(trafficIncrease * 0.88)}%`;
      const predAQI = `${aqiChange >= 0 ? '+' : ''}${Math.round(aqiChange * 0.7)}%`;
      const calculatedDelay = `${trafficIncrease >= 0 ? '+' : ''}${Math.max(1, Math.round((trafficIncrease / 10) * 4 + (weatherSeverity === 'HIGH' ? 7 : 2)))} min`;
      const risk = trafficIncrease > 30 || weatherSeverity === 'HIGH' ? 'HIGH' : (trafficIncrease > 10 ? 'MEDIUM' : 'LOW');

      setResults({
        predictedTraffic: predT,
        aqiImpact: predAQI,
        riskLevel: risk,
        expectedDelay: calculatedDelay
      });
      setHasSimulated(true);
    } finally {
      setTimeout(() => setSimulating(false), 500);
    }
  };

  // Handle Preset Selection
  const handleApplyPreset = (preset) => {
    setTrafficIncrease(preset.trafficVal);
    setAqiChange(preset.aqiVal);
    setWeatherSeverity(preset.weatherVal);
    handleRunSimulation();
  };

  // Reset Controls
  const handleReset = () => {
    setTrafficIncrease(20);
    setAqiChange(10);
    setWeatherSeverity('LOW');
    setResults({
      predictedTraffic: '+18%',
      aqiImpact: '+7%',
      riskLevel: 'HIGH',
      expectedDelay: '+11 min'
    });
  };

  // Dynamic AI Insights list
  const aiInsightsList = useMemo(() => {
    if (trafficIncrease > 25) {
      return [
        'Shift 12% of non-essential traffic to alternative routes between 6-8 PM.',
        'Increase public transport frequency by 20% along high-density corridors.',
        'Activate adaptive signal coordination for Patia - Saheed Nagar corridor.'
      ];
    } else if (aqiChange > 25) {
      return [
        'Issue localized air quality advisories for sensitive groups in industrial zones.',
        'Deploy electric municipal transit fleets to mitigate particulate accumulation.',
        'Restrict heavy goods vehicles during peak stagnant atmosphere windows.'
      ];
    } else {
      return [
        'Maintain baseline adaptive traffic control and green wave signal timing.',
        'Monitor regional arterial junctions for sudden localized commute spikes.',
        'Optimize municipal transit schedules based on real-time sensor feedback.'
      ];
    }
  }, [trafficIncrease, aqiChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
          50% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.7); }
        }
        .simulator-cta-glow {
          animation: pulseGlow 3s infinite ease-in-out;
        }
        .simulator-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #38bdf8;
          cursor: pointer;
          box-shadow: 0 0 10px #38bdf8;
          border: 2px solid #ffffff;
        }
        .simulator-card-hover {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .simulator-card-hover:hover {
          border-color: rgba(56, 189, 248, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* 1. HERO HEADER BANNER WITH URBAN SKYLINE BACKDROP */}
      <div style={{ 
        position: 'relative', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        backgroundImage: 'url(/simulator_city_hero.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        border: '1px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Dark Overlay Gradient */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(135deg, rgba(7, 11, 18, 0.94) 0%, rgba(13, 19, 32, 0.85) 60%, rgba(6, 182, 212, 0.15) 100%)', 
          zIndex: 1 
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ 
              background: 'rgba(6, 182, 212, 0.15)', 
              border: '1px solid rgba(6, 182, 212, 0.4)', 
              color: '#38bdf8', 
              padding: '3px 10px', 
              borderRadius: '20px', 
              fontSize: '0.68rem', 
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              AI Scenario Studio
            </span>
          </div>

          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 900, 
            color: '#ffffff', 
            letterSpacing: '-0.02em', 
            margin: 0,
            background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            What-If Urban Simulator
          </h1>

          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
            Model • Predict • Plan for a Smarter, Safer & Greener City
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px', margin: 0, lineHeight: 1.4 }}>
            Use AI-powered scenario modelling to evaluate urban outcomes before taking action.
          </p>
        </div>

        {/* Top Right Enterprise Indicators Pill */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          background: 'rgba(11, 15, 23, 0.88)', 
          border: '1px solid rgba(255, 255, 255, 0.12)', 
          borderRadius: '12px', 
          padding: '12px 18px',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#ffffff' }}>1.2M</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Daily Commuters</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={16} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#ffffff' }}>85K</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Vehicles Live</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={16} color="#34d399" />
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#34d399' }}>AQI 42</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Good Air Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SCENARIO TYPE NAVIGATION TABS */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        background: 'rgba(11, 15, 23, 0.85)', 
        padding: '6px', 
        borderRadius: '12px', 
        border: '1px solid rgba(255, 255, 255, 0.08)' 
      }}>
        {SCENARIO_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
                background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4) 0%, rgba(6, 182, 212, 0.2) 100%)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                boxShadow: isActive ? '0 4px 12px rgba(6, 182, 212, 0.2)' : 'none'
              }}
            >
              <Icon size={15} color={isActive ? '#38bdf8' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WORKSPACE 2-COLUMN GRID (CONTROLS LEFT + RESULTS RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: SIMULATION CONTROLS WORKSPACE */}
        <div 
          className="card-panel simulator-card-hover" 
          style={{ 
            padding: '22px', 
            background: 'rgba(11, 15, 23, 0.88)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#38bdf8" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Simulation Controls
                </h2>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Adjust variables and run AI simulation for real-time city insights.
              </p>
            </div>

            <button
              onClick={handleReset}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '6px 12px',
                color: '#94a3b8',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Top Selection Inputs Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {/* Scenario Type */}
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Scenario Type
              </label>
              <select
                value={scenarioType}
                onChange={(e) => setScenarioType(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '8px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="Peak Hour Traffic">Peak Hour Traffic</option>
                <option value="Weekend Commute">Weekend Commute</option>
                <option value="Event Surge">Event Surge</option>
                <option value="Emergency Diversion">Emergency Diversion</option>
              </select>
            </div>

            {/* City / Zone */}
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                City / Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '8px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="Saheed Nagar – Patia">Saheed Nagar – Patia</option>
                <option value="Bhubaneswar Central">Bhubaneswar Central</option>
                <option value="Jayadev Vihar Corridor">Jayadev Vihar Corridor</option>
                <option value="Janpath Arterial">Janpath Arterial</option>
              </select>
            </div>

            {/* Time Window */}
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Time Window
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '8px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="6:00 – 9:00 PM">6:00 – 9:00 PM</option>
                <option value="7:00 – 10:00 AM">7:00 – 10:00 AM</option>
                <option value="12:00 – 3:00 PM">12:00 – 3:00 PM</option>
                <option value="10:00 PM – 1:00 AM">10:00 PM – 1:00 AM</option>
              </select>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            
            {/* Traffic Load Increase */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={14} color="#38bdf8" />
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>Traffic Load Increase</span>
                </div>
                <span style={{ 
                  background: 'rgba(6, 182, 212, 0.2)', 
                  border: '1px solid rgba(6, 182, 212, 0.4)', 
                  color: '#38bdf8', 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  fontSize: '0.76rem', 
                  fontWeight: 800 
                }}>
                  {trafficIncrease >= 0 ? `+${trafficIncrease}%` : `${trafficIncrease}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={trafficIncrease}
                onChange={(e) => setTrafficIncrease(Number(e.target.value))}
                className="simulator-slider-input"
                style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', outline: 'none', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
              </div>
            </div>

            {/* AQI Change Factor */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={14} color="#34d399" />
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>AQI Change Factor</span>
                </div>
                <span style={{ 
                  background: 'rgba(52, 211, 153, 0.2)', 
                  border: '1px solid rgba(52, 211, 153, 0.4)', 
                  color: '#34d399', 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  fontSize: '0.76rem', 
                  fontWeight: 800 
                }}>
                  {aqiChange >= 0 ? `+${aqiChange}%` : `${aqiChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={aqiChange}
                onChange={(e) => setAqiChange(Number(e.target.value))}
                className="simulator-slider-input"
                style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', outline: 'none', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
              </div>
            </div>

          </div>

          {/* Weather Severity Selector */}
          <div>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <CloudRain size={14} color="#38bdf8" /> Weather Severity
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {['LOW', 'MEDIUM', 'HIGH'].map((sev) => {
                const isSelected = weatherSeverity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setWeatherSeverity(sev)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isSelected ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#38bdf8' : '#94a3b8',
                      boxShadow: isSelected ? '0 0 12px rgba(6, 182, 212, 0.3)' : 'none'
                    }}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Primary CTA Button */}
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="simulator-cta-glow"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '2px',
              marginTop: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.98rem', fontWeight: 900, letterSpacing: '0.03em' }}>
              {simulating ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Running AI Simulation...</span>
                </>
              ) : (
                <>
                  <Play size={18} fill="#ffffff" />
                  <span>Run AI Simulation</span>
                  <Zap size={18} color="#fef08a" />
                </>
              )}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              Get Instant Insights & Recommendations
            </span>
          </button>

        </div>

        {/* RIGHT COLUMN: SIMULATION RESULTS & ANALYTICS */}
        <div 
          className="card-panel simulator-card-hover" 
          style={{ 
            padding: '22px', 
            background: 'rgba(11, 15, 23, 0.88)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#38bdf8" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Simulation Results
              </h2>
            </div>

            <span style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid rgba(16, 185, 129, 0.4)', 
              color: '#34d399', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.68rem', 
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={12} />
              AI Analysis Complete
            </span>
          </div>

          {/* 4 Primary KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
            {/* Predicted Traffic */}
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>
                {results.predictedTraffic}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                Predicted Traffic
              </div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>(vs. Normal)</div>
            </div>

            {/* AQI Impact */}
            <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#c084fc' }}>
                {results.aqiImpact}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                AQI Impact
              </div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>(vs. Current)</div>
            </div>

            {/* Risk Level */}
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fbbf24' }}>
                {results.riskLevel}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                Risk Level
              </div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>(Congestion)</div>
            </div>

            {/* Expected Delay */}
            <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '12px 14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8' }}>
                {results.expectedDelay}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                Expected Delay
              </div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>(Avg.)</div>
            </div>

          </div>

          {/* Real Analytics Area (Traffic Flow Forecast Chart + AQI Details) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
            
            {/* Traffic Flow Forecast Chart */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                Traffic Flow Forecast
              </div>
              <div style={{ height: '110px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#0d131c', border: '1px solid #202b38', borderRadius: '6px', fontSize: '0.68rem' }} />
                    <Area type="monotone" dataKey="density" stroke="#c084fc" strokeWidth={2} fill="url(#colorDensity)" name="Density %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AQI Impact Progress & Risk Summary */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#34d399' }}>AQI Impact</div>
                <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                  {results.aqiImpact} Increase in AQI
                </div>
                <div style={{ width: '100%', background: '#1e293b', height: '6px', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', background: 'linear-gradient(90deg, #34d399, #fbbf24, #ef4444)', height: '100%' }} />
                </div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '3px' }}>
                  Current: 42 → Predicted: {Math.round(42 * (1 + aqiChange / 100))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', marginTop: '6px' }}>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Risk Level</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fbbf24' }}>HIGH (Congestion & Pollution)</div>
              </div>
            </div>

          </div>

          {/* Bottom Row: AI Insights & Model Confidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
            
            {/* AI Insights & Recommendations */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Lightbulb size={14} color="#38bdf8" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>AI Insights & Recommendations</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.66rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                {aiInsightsList.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Model Confidence Meter */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                position: 'relative', 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                background: 'conic-gradient(#06b6d4 0% 94%, #1e293b 94% 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0d131c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 900, color: '#38bdf8' }}>
                  94%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>Model Confidence</div>
                <div style={{ fontSize: '0.64rem', color: '#34d399', fontWeight: 700 }}>High Confidence</div>
                <div style={{ fontSize: '0.58rem', color: '#64748b' }}>Based on 5,000+ data points</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. PRE-CONFIGURED MUNICIPAL SCENARIO STRESS TESTS GRID */}
      <div 
        className="card-panel" 
        style={{ 
          padding: '20px', 
          background: 'rgba(11, 15, 23, 0.85)', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '14px' 
        }}
      >
        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="#38bdf8" />
          <span>Pre-Configured Municipal Scenario Stress Tests</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {PRECONFIGURED_PRESETS.map((preset) => (
            <div 
              key={preset.id}
              style={{ 
                background: 'rgba(15, 23, 42, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: preset.color, marginBottom: '4px' }}>
                  {preset.icon} {preset.title}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {preset.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: preset.color }}>
                  {preset.impact}
                </span>

                <button
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '6px',
                    color: '#38bdf8',
                    padding: '4px 10px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Run Scenario
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SYSTEM STATUS FOOTER */}
      <div style={{ 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        padding: '10px 16px', 
        background: 'rgba(11, 15, 23, 0.95)', 
        border: '1px solid rgba(255, 255, 255, 0.08)', 
        borderRadius: '10px',
        fontSize: '0.7rem',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
            Live Data
          </span>
          <span style={{ color: '#c084fc', fontWeight: 700 }}>★ AI Powered</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>✖ Real-time Simulation</span>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>● Data Driven</span>
        </div>

        <div style={{ fontWeight: 600, color: '#64748b' }}>
          UrbanPulse AI – Building Smarter Cities with Artificial Intelligence
        </div>
      </div>

    </div>
  );
};

export default WhatIfSimulatorWidget;
