import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import PollutionIntelligenceView from '../components/PollutionIntelligenceView';

export const EnvironmentalIntelligence = () => {
  return (
    <PageContainer
      title="Environmental & AQI Intelligence"
      subtitle="Air Quality Index, fine particulate (PM2.5/PM10) dynamics, and atmospheric weather correlations"
      badge={<Badge variant="healthy">Environmental Telemetry</Badge>}
    >
      <PollutionIntelligenceView />
    </PageContainer>
  );
};

export default EnvironmentalIntelligence;
