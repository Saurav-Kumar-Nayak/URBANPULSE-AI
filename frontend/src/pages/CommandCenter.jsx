import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useDashboard } from '../hooks/useDashboard';
import KpiCards from '../components/KpiCards';
import LiveCityMap from '../components/LiveCityMap';
import TrafficIntelligenceView from '../components/TrafficIntelligenceView';
import AnomalyRadar from '../components/AnomalyRadar';
import InsightEngineView from '../components/InsightEngineView';
import PollutionIntelligenceView from '../components/PollutionIntelligenceView';

export const CommandCenter = () => {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) return <PageContainer><LoadingSpinner label="Initializing Command Center Telemetry..." /></PageContainer>;
  if (error) return <PageContainer><EmptyState title="Telemetry Error" message={error} onRetry={refetch} /></PageContainer>;

  return (
    <PageContainer
      title="URBANPULSE AI"
      subtitle="Urban Intelligence Command Center — Real-Time Metropolitan Analytics & ML Predictive Operations"
      badge={<Badge variant="cyan">Command Mode</Badge>}
    >
      {/* Hero KPIs Header */}
      <KpiCards kpis={data?.kpis || []} />

      {/* Main Grid: Live City Map & Intelligence Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card-panel" style={{ padding: '20px', minHeight: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              Live Urban Geospatial Intelligence
            </h3>
            <Badge variant="healthy">Live Map Layer</Badge>
          </div>
          <LiveCityMap />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InsightEngineView />
          <AnomalyRadar />
        </div>
      </div>

      {/* Analytics & Traffic Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <TrafficIntelligenceView />
        <PollutionIntelligenceView />
      </div>
    </PageContainer>
  );
};

export default CommandCenter;
