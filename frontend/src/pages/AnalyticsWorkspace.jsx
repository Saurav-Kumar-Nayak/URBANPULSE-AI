import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import DataExplorer from '../components/DataExplorer';

export const AnalyticsWorkspace = () => {
  return (
    <PageContainer
      title="Advanced Analytics Workspace"
      subtitle="Searchable 5,200 record urban telemetry database with multi-factor filtering and streaming CSV export"
      badge={<Badge variant="cyan">Full Dataset Access</Badge>}
    >
      <DataExplorer />
    </PageContainer>
  );
};

export default AnalyticsWorkspace;
