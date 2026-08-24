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
      
      {/* MAIN 2-COLUMN COMMAND CENTER GRID */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '280px 1fr', 
          gap: '16px',
          alignItems: 'start' 
        }} 
        className="command-center-layout"
      >
        
        {/* LEFT COLUMN: CURRENT LOCATION & URBAN INTELLIGENCE */}
        <LeftIntelligencePanel 
          overview={data} 
          activeZone={selectedZone}
          onLocationDetected={(loc) => setUserLocation(loc)} 
        />

        {/* RIGHT MAIN CONTAINER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* 1. TOP COMPACT KPI STRIP */}
          <KpiCards kpis={data?.kpis || []} overview={data} activeZone={selectedZone} />

          {/* 2. HERO GEOSPATIAL MAP & AI CITY INSIGHTS */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 340px', 
              gap: '16px',
              alignItems: 'stretch' 
            }}
            className="command-center-map-grid"
          >
            {/* Live Geospatial Twin City Map */}
            <LiveCityMap 
              locations={data?.locations || []} 
              selectedZone={selectedZone} 
              onSelectZone={setSelectedZone} 
              mapHeight="520px"
              userLocation={userLocation}
            />

            {/* AI Autonomous City Insights */}
            <AICityInsights />
          </div>

          {/* 3. PREDICTION TIMELINE BAND */}
          <PredictionTimeline activeZone={selectedZone} />

          {/* 4. DECISION & SIMULATION GRID (ALERTS, TRAFFIC FEED, WHAT-IF SIMULATOR) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ActiveAlertCenter 
              anomalies={anomaliesData?.recent_anomalies || []}
              activeZone={selectedZone}
              onSelectZone={setSelectedZone}
              loading={trendLoading}
            />

            <LiveTrafficFeed 
              locationRankings={trafficData?.location_rankings || []}
              activeZone={selectedZone}
              onSelectZone={setSelectedZone}
              loading={trendLoading}
            />
          </div>

          {/* 5. WHAT-IF SIMULATOR WIDGET */}
          <WhatIfSimulatorWidget />

          {/* 6. DYNAMIC ANALYTICS CHARTS */}
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

          {/* 7. SYSTEM TELEMETRY HEALTH BAR */}
          <SystemHealthBar overview={data} />

        </div>

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
