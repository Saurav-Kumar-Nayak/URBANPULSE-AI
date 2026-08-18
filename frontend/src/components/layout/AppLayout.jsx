import React from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const AppLayout = ({ children }) => {
  const { activeTab, setActiveTab } = useUrbanPulseContext();

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'command-center': return 'Urban Intelligence Command Center';
      case 'live-city': return 'Live City Telemetry Map';
      case 'predictions': return 'AI Predictive Analytics Studio';
      case 'traffic': return 'Traffic Intelligence & Corridor Flow';
      case 'environment': return 'Environmental & AQI Intelligence';
      case 'risk': return 'Risk Radar & Multivariate Anomalies';
      case 'analytics': return 'Advanced Analytics Workspace';
      case 'ml-models': return 'Scikit-Learn ML Model Specs';
      case 'ai-copilot': return 'UrbanPulse AI Copilot';
      case 'api-docs': return 'FastAPI OpenAPI & Reference';
      case 'settings': return 'System Settings';
      default: return 'UrbanPulse AI Command Platform';
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-wrapper">
        <Navbar title={getPageTitle(activeTab)} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
