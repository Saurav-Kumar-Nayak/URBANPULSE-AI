import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { useDashboard } from '../hooks/useDashboard';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import dashboardService from '../services/dashboardService';

import LiveCityMap from '../components/LiveCityMap';
import KpiCards from '../components/KpiCards';
import LeftIntelligencePanel from '../components/dashboard/LeftIntelligencePanel';
import LiveTrafficFeed from '../components/dashboard/LiveTrafficFeed';
import ActiveAlertCenter from '../components/dashboard/ActiveAlertCenter';
import DynamicCharts from '../components/dashboard/DynamicCharts';
import AICityInsights from '../components/dashboard/AICityInsights';
import WhatIfSimulatorWidget from '../components/dashboard/WhatIfSimulatorWidget';
import PredictionTimeline from '../components/dashboard/PredictionTimeline';
import SystemHealthBar from '../components/dashboard/SystemHealthBar';

import { Sparkles } from 'lucide-react';

export const CommandCenter = () => {
  const { data, loading, error, refetch } = useDashboard();
  const { isCopilotOpen, toggleCopilot } = useUrbanPulseContext();
  const [selectedZone, setSelectedZone] = useState('LOC-01');

  // Dynamic Timeframe State
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [trafficData, setTrafficData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [trendLoading, setTrendLoading] = useState(false);

  // User location override state
  const [userLocation, setUserLocation] = useState(null);

  // Fetch trend datasets when timeframe changes
  useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      setTrendLoading(true);
      try {
        const [tRes, pRes, aRes] = await Promise.all([
          dashboardService.getTraffic({ timeframe: activeTimeframe }),
          dashboardService.getPollution({ timeframe: activeTimeframe }),
          dashboardService.getAnomalies()
        ]);
        if (isMounted) {
          setTrafficData(tRes);
          setPollutionData(pRes);
          setAnomaliesData(aRes);
        }
      } catch (e) {
        console.warn("Failed to fetch timeframe data:", e);
      } finally {
        if (isMounted) setTrendLoading(false);
      }
    };
    fetchTrends();
    return () => { isMounted = false; };
  }, [activeTimeframe]);

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner label="Initializing Metropolitan Digital Twin Command Center..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <EmptyState title="Telemetry Sync Error" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 20px 30px 20px', background: '#0b0f17', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* TOP COMPACT KPI STRIP */}
      <div style={{ marginBottom: '16px' }}>
        <KpiCards kpis={data?.kpis || []} overview={data} activeZone={selectedZone} />
      </div>

      {/* MAIN 3-COLUMN OPERATIONAL COMMAND CENTER GRID */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '290px 1fr 360px', 
          gap: '16px',
          alignItems: 'start' 
        }} 
        className="command-center-layout"
      >
        
        {/* LEFT COLUMN: CITY STATUS & MUNICIPAL TELEMETRY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <LeftIntelligencePanel 
            overview={data} 
            activeZone={selectedZone}
            onLocationDetected={(loc) => setUserLocation(loc)} 
          />
        </div>

        {/* CENTER COLUMN: PRIMARY DIGITAL TWIN & MAP ANCHOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* DIGITAL TWIN HEADER */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'space-between',
              background: '#0d131c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '10px 16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 8px #06b6d4' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>GEOSPATIAL DIGITAL TWIN</span>
              <span style={{ opacity: 0.3, color: '#94a3b8' }}>|</span>
              <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE GIS TELEMETRY</span>
            </div>

            <div style={{ fontSize: '0.70rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              GRID: <span style={{ color: '#f8fafc', fontWeight: 700 }}>20.3547° N, 85.8153° E</span>
            </div>
          </div>

          {/* HERO GEOSPATIAL MAP */}
          <LiveCityMap 
            locations={data?.locations || []} 
            selectedZone={selectedZone} 
            onSelectZone={setSelectedZone} 
            mapHeight="540px"
            userLocation={userLocation}
          />

          {/* PREDICTION TIMELINE BAND */}
          <PredictionTimeline activeZone={selectedZone} />

          {/* LIVE TRAFFIC CORRIDOR RANKINGS */}
          <LiveTrafficFeed 
            locationRankings={trafficData?.location_rankings || []}
            activeZone={selectedZone}
            onSelectZone={setSelectedZone}
            loading={trendLoading}
          />
        </div>

        {/* RIGHT COLUMN: OPERATIONS INTELLIGENCE & ALERTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* LIVE OPERATIONAL INCIDENTS & ALERTS */}
          <ActiveAlertCenter 
            anomalies={anomaliesData?.recent_anomalies || []}
            activeZone={selectedZone}
            onSelectZone={setSelectedZone}
            loading={trendLoading}
          />

          {/* AI CITY INTELLIGENCE */}
          <AICityInsights />

        </div>

      </div>

      {/* BOTTOM OPERATIONS SECTION: WHAT-IF SIMULATOR & CHARTS */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* WHAT-IF SIMULATOR WIDGET */}
        <WhatIfSimulatorWidget />

        {/* DYNAMIC ANALYTICS CHARTS */}
        <DynamicCharts
          pollutionData={pollutionData}
          trafficData={trafficData}
          anomaliesData={anomaliesData}
          overviewData={data}
          activeZone={selectedZone}
          activeTimeframe={activeTimeframe}
          onTimeframeChange={(tf) => setActiveTimeframe(tf)}
          loading={trendLoading}
        />

        {/* SYSTEM TELEMETRY HEALTH BAR */}
        <SystemHealthBar overview={data} />

      </div>

      {/* FLOATING AI COPILOT BUTTON */}
      {!isCopilotOpen && (
        <button
          onClick={toggleCopilot}
          className="copilot-floating-btn"
          id="btn-floating-copilot"
          title="Open UrbanPulse AI Copilot"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1050,
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 18px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={16} color="#ffffff" />
          <span>✦ Ask AI Copilot</span>
        </button>
      )}

    </div>
  );
};

export default CommandCenter;
