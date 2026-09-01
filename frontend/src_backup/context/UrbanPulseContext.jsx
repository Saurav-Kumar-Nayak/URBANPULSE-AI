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

const PROTECTED_TABS = ['command-center', 'dashboard', 'what-if', 'simulator', 'analytics', 'ml-models', 'ai-copilot', 'settings'];

export const UrbanPulseProvider = ({ children }) => {
  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');
  
  // Authentication & Role State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('urbanpulse_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Evidence Modal State
  const [selectedInsightEvidence, setSelectedInsightEvidence] = useState(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const openEvidenceModal = (insight) => {
    setSelectedInsightEvidence(insight);
    setIsEvidenceModalOpen(true);
  };

  const closeEvidenceModal = () => {
    setIsEvidenceModalOpen(false);
    setSelectedInsightEvidence(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('urbanpulse_token');
  const role = isAuthenticated ? (user.role || 'OPERATOR') : 'PUBLIC_USER';

  // Check auth session on startup
  useEffect(() => {
    const token = localStorage.getItem('urbanpulse_token');
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('urbanpulse_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Clear invalid session
          localStorage.removeItem('urbanpulse_token');
          localStorage.removeItem('urbanpulse_user');
          setUser(null);
        });
    }
  }, []);

  const setActiveTab = (tab) => {
    // Protected route check
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      setIsLoginModalOpen(true);
      setAuthError('Authorized municipal operator access required to view Command Center.');
      setActiveTabState('home');
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
      return;
    }

    setActiveTabState(tab);
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Perform route check if user directly entered URL on load
  useEffect(() => {
    const currentTab = getInitialTab();
    if (PROTECTED_TABS.includes(currentTab) && !isAuthenticated) {
      setActiveTabState('home');
      setIsLoginModalOpen(true);
      setAuthError('Authorized municipal operator access required.');
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [isAuthenticated]);

  const login = async (username, password) => {
    setAuthError(null);
    try {
      const res = await api.login(username, password);
      if (res && res.access_token) {
        localStorage.setItem('urbanpulse_token', res.access_token);
        localStorage.setItem('urbanpulse_user', JSON.stringify(res.user));
        setUser(res.user);
        setIsLoginModalOpen(false);
        setActiveTab('command-center');
        return { success: true, user: res.user };
      }
      throw new Error('Invalid login response');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Authentication failed.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('urbanpulse_token');
    localStorage.removeItem('urbanpulse_user');
    setUser(null);
    setActiveTabState('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  const openCopilotWithQuery = (query = '') => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      setAuthError('AI Copilot operator interface requires sign in.');
      return;
    }
    setCopilotInitialQuery(query);
    setIsCopilotOpen(true);
  };

  const toggleCopilot = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      setAuthError('AI Copilot operator interface requires sign in.');
      return;
    }
    setIsCopilotOpen(prev => !prev);
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getInitialTab();
      if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
        setActiveTabState('home');
        setIsLoginModalOpen(true);
      } else {
        setActiveTabState(tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

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
        // Evidence Modal State
        selectedInsightEvidence,
        isEvidenceModalOpen,
        openEvidenceModal,
        closeEvidenceModal,
        // Authentication & Role State
        user,
        role,
        isAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        authError,
        setAuthError,
        login,
        logout
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
