import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from './ui/LoadingSpinner';
import PollutionHeader from './pollution/PollutionHeader';
import AQIKPICards from './pollution/AQIKPICards';
import AQITrendChart from './pollution/AQITrendChart';
import PollutantMetricGrid from './pollution/PollutantMetricGrid';
import AIEnvironmentalInsights from './pollution/AIEnvironmentalInsights';
import HealthGuidance from './pollution/HealthGuidance';
import TelemetryStatus from './pollution/TelemetryStatus';
import MapCTA from './pollution/MapCTA';

export default function PollutionIntelligenceView({ pollutionData: initialData = null }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Saheed Nagar, Bhubaneswar');
  const [locations, setLocations] = useState([]);

  // Fetch Locations & Pollution Data
  const loadPollutionData = (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    Promise.all([
      api.getPollution(),
      api.getLocations().catch(() => [])
    ])
      .then(([resPollution, resLocations]) => {
        setData(resPollution);
        if (Array.isArray(resLocations) && resLocations.length > 0) {
          setLocations(resLocations);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch environmental telemetry:", err);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
    } else {
      loadPollutionData();
    }
  }, [initialData]);

  if (loading && !data) {
    return <LoadingSpinner label="Loading Municipal Environmental Intelligence..." />;
  }

  const avgAqi = data?.avg_aqi || 101;
  const maxAqi = data?.max_aqi || 358;
  const trends = data?.aqi_trends || [];
  const pmBreakdown = data?.pm_breakdown || [];
  const pm25Item = pmBreakdown.find(p => p.pollutant.includes('PM2.5')) || { avg_value: 28.5 };
  const pm10Item = pmBreakdown.find(p => p.pollutant.includes('PM10')) || { avg_value: 46 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#050B18', minHeight: '100vh' }}>
      
      {/* 1. Header & Location Selector */}
      <PollutionHeader
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        locations={locations}
        onRefresh={() => loadPollutionData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 2. Primary KPI Cards (Current AQI, Peak AQI, Primary Pollutant) */}
      <AQIKPICards
        avgAqi={avgAqi}
        maxAqi={maxAqi}
        pm25Val={pm25Item.avg_value}
        primaryPollutant="PM2.5"
      />

      {/* 3. Main AQI & Particulate Trend Chart */}
      <AQITrendChart trendsData={trends} />

      {/* 4. Pollutant Metric Grid */}
      <PollutantMetricGrid
        pm10Val={pm10Item.avg_value || 46}
        no2Val={22}
        o3Val={18}
        coVal={0.6}
        so2Val={7}
        humidityVal={65}
      />

      {/* 5. AI Environmental Insights & Health Guidance (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <AIEnvironmentalInsights />
        <HealthGuidance avgAqi={avgAqi} />
      </div>

      {/* 6. Municipal Sensor Telemetry Status */}
      <TelemetryStatus />

      {/* 7. Live 3D Digital Twin Map Connection CTA */}
      <MapCTA />

    </div>
  );
}
