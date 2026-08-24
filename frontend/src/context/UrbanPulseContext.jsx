import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const UrbanPulseContext = createContext();

const getInitialTab = () => {
  const path = window.location.pathname.replace(/^\//, '').trim();
  if (!path || path === '/' || path === 'home') return 'home';
  const knownTabs = [
    'home', 'command-center', 'dashboard', 'live-city', 'predictions', 'traffic', 
    'environment', 'pollution', 'weather', 'risk', 'what-if', 
    'analytics', 'ml-models', 'ai-copilot', 'api-docs', 'settings'
  ];
  return knownTabs.includes(path) ? path : 'home';
};

export const UrbanPulseProvider = ({ children }) => {
  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const openCopilotWithQuery = (query = '') => {
    setCopilotInitialQuery(query);
    setIsCopilotOpen(true);
  };

  const toggleCopilot = () => {
    setIsCopilotOpen(prev => !prev);
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
        isCopilotOpen,
        setIsCopilotOpen,
        toggleCopilot,
        copilotInitialQuery,
        openCopilotWithQuery,
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
