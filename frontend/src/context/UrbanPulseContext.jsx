import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const UrbanPulseContext = createContext();

const getInitialTab = () => {
  const path = window.location.pathname.replace(/^\//, '').trim();
  if (!path || path === '/') return 'command-center';
  const knownTabs = [
    'command-center', 'live-city', 'predictions', 'traffic', 
    'environment', 'risk', 'analytics', 'ml-models', 
    'ai-copilot', 'api-docs', 'settings'
  ];
  return knownTabs.includes(path) ? path : 'command-center';
};

export const UrbanPulseProvider = ({ children }) => {
  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (window.location.pathname !== `/${tab}`) {
      window.history.pushState({}, '', `/${tab}`);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const checkHealth = async () => {
    try {
      const health = await api.getHealth();
      setIsBackendOnline(health?.status === 'online');
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setIsBackendOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const triggerGlobalRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    checkHealth();
  };

  return (
    <UrbanPulseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isBackendOnline,
        selectedZone,
        setSelectedZone,
        lastUpdated,
        refreshTrigger,
        triggerGlobalRefresh,
      }}
    >
      {children}
    </UrbanPulseContext.Provider>
  );
};

export const useUrbanPulseContext = () => {
  const context = useContext(UrbanPulseContext);
  if (!context) {
    throw new Error('useUrbanPulseContext must be used within an UrbanPulseProvider');
  }
  return context;
};

export default UrbanPulseContext;
