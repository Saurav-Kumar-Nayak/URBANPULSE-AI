import React from 'react';
import { Wind, AlertTriangle, Activity } from 'lucide-react';
import UrbanMetricCard from '../ui/UrbanMetricCard';

export const AQIKPICards = ({ avgAqi = 101, maxAqi = 358, pm25Val = 28.5, primaryPollutant = "PM2.5" }) => {
  
  // Calculate AQI category & status
  const getAQICategory = (val) => {
    if (val <= 50) return { label: 'GOOD', statusType: 'healthy', color: '#27D17F', desc: 'Air quality is satisfactory and poses little risk.' };
    if (val <= 100) return { label: 'MODERATE', statusType: 'warning', color: '#FFB020', desc: 'Acceptable air quality. Sensitive groups take precaution.' };
    if (val <= 150) return { label: 'UNHEALTHY', statusType: 'warning', color: '#FF9800', desc: 'Sensitive groups may experience health effects.' };
    if (val <= 200) return { label: 'UNHEALTHY', statusType: 'critical', color: '#FF5A67', desc: 'Everyone may begin to experience health effects.' };
    return { label: 'VERY POOR', statusType: 'critical', color: '#FF5A67', desc: 'Emergency threshold. Entire population affected.' };
  };

  const currentCat = getAQICategory(avgAqi);
  const peakCat = getAQICategory(maxAqi);
  const pmPercentage = Math.min(100, Math.round((pm25Val / 35.0) * 100));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }} className="urban-card-grid-container grid-3">
      {/* CARD 1: CURRENT AQI */}
      <UrbanMetricCard
        title="Current Air Quality Index"
        category="AQI TELEMETRY"
        value={avgAqi}
        unit="AQI"
        description={currentCat.desc}
        trend="+3.2% vs 1hr ago"
        trendDirection="up"
        status={currentCat.label}
        statusType={currentCat.statusType}
        icon={Wind}
        iconColor={currentCat.color}
        chartType="sparkline"
        chartData={[65, 72, 80, 78, 92, 105, 98, avgAqi]}
        actionLabel="Explore Stations"
      />

      {/* CARD 2: PEAK RECORDED AQI */}
      <UrbanMetricCard
        title="Peak Recorded Spikes"
        category="CRITICAL ANOMALY"
        value={maxAqi}
        unit="AQI"
        description="Industrial shift window spike"
        previousValue="280 AQI"
        trend="Peak Alert"
        trendDirection="down"
        status={peakCat.label}
        statusType="critical"
        icon={AlertTriangle}
        iconColor="#FF5A67"
        chartType="bar"
        chartData={[40, 60, 90, 140, 220, 358, 280, 190]}
        actionLabel="Trace Source"
      />

      {/* CARD 3: PRIMARY POLLUTANT */}
      <UrbanMetricCard
        title={`Primary Pollutant (${primaryPollutant})`}
        category="PARTICULATE MATTER"
        value={pm25Val}
        unit="µg/m³"
        description={`${pmPercentage}% of WHO safe threshold (35 µg/m³)`}
        trend="Elevated Level"
        trendDirection="neutral"
        status="Active Monitored"
        statusType="optimal"
        icon={Activity}
        iconColor="#20D9FF"
        chartType="radial"
        chartData={[pmPercentage]}
        actionLabel="Pollutant Breakdown"
      />
    </div>
  );
};

export default AQIKPICards;
