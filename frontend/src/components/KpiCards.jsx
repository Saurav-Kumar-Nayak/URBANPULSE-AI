import React from 'react';
import { Users, Building2, MapPin, Database, AlertTriangle } from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import UrbanMetricCard from './ui/UrbanMetricCard';

export default function KpiCards({ overview = null, activeZone = null, kpis = [], loading = false }) {
  const { setActiveTab } = useUrbanPulseContext();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }} className="urban-card-grid-container grid-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <UrbanMetricCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  // Zone specific metrics or default city metrics
  const popVal = activeZone?.population || '968K';
  const areaVal = activeZone?.areaSqKm ? `${activeZone.areaSqKm} sq km` : '176 sq km';
  const zonesVal = activeZone?.sensorNodes ? `${activeZone.sensorNodes}` : '52';
  const sourcesVal = activeZone?.dataSources ? `${activeZone.dataSources}` : '128+';
  const activeAlertsVal = activeZone?.alertsCount !== undefined ? `${activeZone.alertsCount}` : '3 Active';
  const anomalyCountText = overview?.anomaly_count ? `${overview.anomaly_count} Anomalies` : '25 Logged';

  const cards = [
    {
      id: 'population',
      title: 'Population',
      category: 'DEMOGRAPHICS',
      value: popVal,
      trend: '+2.3%',
      trendDirection: 'up',
      status: 'Optimal',
      statusType: 'healthy',
      icon: Users,
      iconColor: '#20D9FF',
      chartType: 'sparkline',
      chartData: [45, 52, 58, 62, 70, 75, 82, 95]
    },
    {
      id: 'area',
      title: 'Municipal Area',
      category: 'GIS BOUNDARY',
      value: areaVal,
      trend: '100% Mapped',
      trendDirection: 'neutral',
      status: 'Active GIS',
      statusType: 'optimal',
      icon: Building2,
      iconColor: '#78AAFF',
      chartType: 'bar',
      chartData: [30, 40, 35, 50, 45, 60, 55]
    },
    {
      id: 'zones',
      title: 'Monitoring Nodes',
      category: 'IOT TELEMETRY',
      value: zonesVal,
      trend: '+4 Online',
      trendDirection: 'up',
      status: 'Synchronized',
      statusType: 'healthy',
      icon: MapPin,
      iconColor: '#27D17F',
      chartType: 'radial',
      chartData: [92]
    },
    {
      id: 'sources',
      title: 'Data Feeds',
      category: 'INGESTION PIPELINE',
      value: sourcesVal,
      trend: '99.9% Uptime',
      trendDirection: 'up',
      status: 'Optimal',
      statusType: 'optimal',
      icon: Database,
      iconColor: '#9D64FF',
      chartType: 'sparkline',
      chartData: [60, 65, 70, 80, 85, 90, 98, 100]
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      category: 'RISK CENTER',
      value: activeAlertsVal,
      description: anomalyCountText,
      trend: 'Action Required',
      trendDirection: 'down',
      status: 'Needs Review',
      statusType: 'critical',
      icon: AlertTriangle,
      iconColor: '#FF5A67',
      chartType: 'sparkline',
      chartData: [10, 15, 25, 18, 30, 45, 38, 55],
      actionLabel: 'Review Alerts'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }} className="urban-card-grid-container grid-5">
      {cards.map((card) => (
        <UrbanMetricCard
          key={card.id}
          title={card.title}
          category={card.category}
          value={card.value}
          trend={card.trend}
          trendDirection={card.trendDirection}
          description={card.description}
          status={card.status}
          statusType={card.statusType}
          icon={card.icon}
          iconColor={card.iconColor}
          chartType={card.chartType}
          chartData={card.chartData}
          actionLabel={card.actionLabel || 'Inspect'}
          onClick={() => {
            if (card.id === 'alerts') setActiveTab('risk');
            else if (card.id === 'zones') setActiveTab('liveMap');
            else setActiveTab('analytics');
          }}
        />
      ))}
    </div>
  );
}
