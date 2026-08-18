import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import PredictiveStudio from '../components/PredictiveStudio';

export const Predictions = () => {
  return (
    <PageContainer
      title="AI Predictive Analytics Studio"
      subtitle="Execute real-time Scikit-learn inference for AQI, Congestion, and Urban Risk models"
      badge={<Badge variant="violet">Scikit-Learn Powered</Badge>}
    >
      <PredictiveStudio />
    </PageContainer>
  );
};

export default Predictions;
