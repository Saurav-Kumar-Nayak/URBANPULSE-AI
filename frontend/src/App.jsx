import React from 'react';
import { UrbanPulseProvider, useUrbanPulseContext } from './context/UrbanPulseContext';
import AppLayout from './components/layout/AppLayout';
import CommandCenter from './pages/CommandCenter';
import LiveCity from './pages/LiveCity';
import Predictions from './pages/Predictions';
import TrafficIntelligence from './pages/TrafficIntelligence';
import EnvironmentalIntelligence from './pages/EnvironmentalIntelligence';
import RiskAnomalies from './pages/RiskAnomalies';
import AnalyticsWorkspace from './pages/AnalyticsWorkspace';
import MLModelCenter from './pages/MLModelCenter';
import AICopilotPage from './pages/AICopilotPage';
import ApiDocsPage from './pages/ApiDocsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { activeTab, refreshTrigger } = useUrbanPulseContext();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'command-center':
      case 'dashboard':
        return <CommandCenter key={refreshTrigger} />;
      case 'live-city':
        return <LiveCity key={refreshTrigger} />;
      case 'predictions':
        return <Predictions key={refreshTrigger} />;
      case 'traffic':
        return <TrafficIntelligence key={refreshTrigger} />;
      case 'environment':
      case 'pollution':
        return <EnvironmentalIntelligence key={refreshTrigger} />;
      case 'risk':
      case 'anomalies':
        return <RiskAnomalies key={refreshTrigger} />;
      case 'analytics':
      case 'explorer':
        return <AnalyticsWorkspace key={refreshTrigger} />;
      case 'ml-models':
        return <MLModelCenter key={refreshTrigger} />;
      case 'ai-copilot':
      case 'insights':
        return <AICopilotPage key={refreshTrigger} />;
      case 'api-docs':
      case 'apidocs':
        return <ApiDocsPage key={refreshTrigger} />;
      case 'settings':
        return <SettingsPage key={refreshTrigger} />;
      default:
        return <CommandCenter key={refreshTrigger} />;
    }
  };

  return <AppLayout>{renderActivePage()}</AppLayout>;
}

export default function App() {
  return (
    <UrbanPulseProvider>
      <AppContent />
    </UrbanPulseProvider>
  );
}
