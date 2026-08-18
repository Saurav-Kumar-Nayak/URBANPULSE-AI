import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import AnomalyRadar from '../components/AnomalyRadar';

export const RiskAnomalies = () => {
  return (
    <PageContainer
      title="Risk Radar & Multivariate Anomalies"
      subtitle="IsolationForest anomaly detection stream, urban hazard classifications, and payload surge test runner"
      badge={<Badge variant="warning">IsolationForest Active</Badge>}
    >
      <AnomalyRadar />
    </PageContainer>
  );
};

export default RiskAnomalies;
