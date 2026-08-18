import React, { useState, useEffect } from 'react';
import KpiCards from '../components/KpiCards';
import LiveCityMap from '../components/LiveCityMap';
import AnomalyRadar from '../components/AnomalyRadar';
import TrafficIntelligenceView from '../components/TrafficIntelligenceView';
import InsightEngineView from '../components/InsightEngineView';
import { api } from '../services/api';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [locations, setLocations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [anomalyStats, setAnomalyStats] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [selectedZone, setSelectedZone] = useState('LOC-01');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [oRes, lRes, aRes, tRes] = await Promise.all([
        api.getOverview(),
        api.getLocations(),
        api.getAnomalies({ limit: 6 }),
        api.getTraffic()
      ]);

      setOverview(oRes);
      setLocations(lRes);
      setAnomalies(aRes.recent_anomalies || []);
      setAnomalyStats(aRes);
      setTraffic(tRes);
    } catch (e) {
      console.error("Error fetching dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Dynamic Metric Cards */}
      <KpiCards kpis={overview?.kpis || []} overview={overview} loading={loading} />

      {/* 2. Interactive Geospatial City Map */}
      <LiveCityMap 
        locations={locations} 
        anomalies={anomalies} 
        selectedZone={selectedZone} 
        onSelectZone={setSelectedZone} 
      />

      {/* 3. Traffic Profile Overview */}
      <TrafficIntelligenceView trafficData={traffic} />

      {/* 4. Anomaly Radar & Log Table */}
      <AnomalyRadar anomalies={anomalies} stats={anomalyStats} onRefresh={fetchDashboardData} />

      {/* 5. AI Insight Engine Summary */}
      <InsightEngineView />
    </div>
  );
}
