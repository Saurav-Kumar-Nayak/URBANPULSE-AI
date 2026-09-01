import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import WhatIfSimulatorWidget from '../components/dashboard/WhatIfSimulatorWidget';

export const WhatIfSimulator = () => {
  return (
    <PageContainer>
      <WhatIfSimulatorWidget />
    </PageContainer>
  );
};

export default WhatIfSimulator;
