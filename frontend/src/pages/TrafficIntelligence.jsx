import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import TrafficIntelligenceView from '../components/TrafficIntelligenceView';

export const TrafficIntelligence = () => {
  return (
    <PageContainer
      title="Traffic Intelligence & Corridor Flow"
      subtitle="Arterial congestion analysis, peak-hour bottlenecks, and 12-hour predictive traffic forecast"
      badge={<Badge variant="cyan">Flow Telemetry</Badge>}
    >
      <TrafficIntelligenceView />
    </PageContainer>
  );
};

export default TrafficIntelligence;
