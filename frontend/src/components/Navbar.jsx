import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon,
  Activity, 
  Map, 
  TrendingUp, 
  ShieldAlert, 
  Car, 
  Wind, 
  CloudSun, 
  Sliders, 
  Cpu, 
  Sparkles, 
  Bell, 
  RefreshCw, 
  Menu, 
  X, 
  User, 
  Github,
  Radio
} from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isBackendOnline, 
    lastUpdated, 
    triggerGlobalRefresh,
    toggleCopilot,
    openCopilotWithQuery
  } = useUrbanPulseContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'command-center', label: 'Command Center', icon: Activity },
    { id: 'live-city', label: 'Live Map', icon: Map },
    { id: 'predictions', label: 'Predictive Analytics', icon: TrendingUp },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'pollution', label: 'Air Quality', icon: Wind },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    triggerGlobalRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="top-nav-container">
      {/* LEFT: Brand Logo & Title (3D Tactile Pill) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => handleNavClick('home')} 
          className="top-nav-brand"
          title="UrbanPulse AI Home"
        >
          <div className="top-nav-logo">
            <Activity size={19} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
            <div className="top-nav-title">UrbanPulse AI</div>
            <div className="top-nav-subtitle">Smart City Intelligence</div>
          </div>
        </button>
      </div>

      {/* CENTER: Navigation Tabs (Desktop & Tablet) */}
      <nav className="top-nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || 
            (item.id === 'pollution' && activeTab === 'environment') ||
            (item.id === 'command-center' && (activeTab === 'dashboard' || activeTab === 'command-center'));
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`top-nav-link ${isActive ? 'active' : ''}`}
              id={`nav-link-${item.id}`}
            >
              <Icon size={15} color={isActive ? '#06b6d4' : '#94a3b8'} />
              <span>{item.id === 'command-center' ? 'Dashboard' : item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RIGHT: Actions & Controls */}
      <div className="top-nav-actions">
        {/* System Online Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: isBackendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            border: `1px solid ${isBackendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: isBackendOnline ? '#34d399' : '#fb7185',
          }}
          title={isBackendOnline ? 'FastAPI Backend & SQLite connected' : 'Backend offline'}
        >
          <span className={`pulse-dot ${isBackendOnline ? 'online' : 'warning'}`} />
          <span>{isBackendOnline ? '● SYSTEM ONLINE' : '● SYSTEM OFFLINE'}</span>
        </div>

        {/* Data Freshness Timestamp */}
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(17, 25, 35, 0.6)',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}
          className="desktop-only"
        >
          <Radio size={13} color="#06b6d4" className="spin" />
          <span>{timeStr}</span>
        </div>

        {/* Refresh / Sync Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title={`Last updated ${lastUpdated}`}
          className="btn-subtle"
          style={{
            padding: '7px 10px',
            borderRadius: '9px',
          }}
        >
          <RefreshCw size={15} className={refreshing ? 'spin' : ''} />
        </button>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="btn-subtle"
            style={{
              padding: '7px 10px',
              borderRadius: '9px',
              position: 'relative'
            }}
          >
            <Bell size={15} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#f43f5e'
            }} />
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '45px',
                right: '0',
                width: '300px',
                background: '#0d131c',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                zIndex: 120
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                Operational Alerts & Telemetry
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ color: '#fb7185', background: 'rgba(244,63,94,0.1)', padding: '6px 8px', borderRadius: '6px' }}>
                  🔴 <strong>Jayadev Vihar:</strong> Congestion index surge (+18% above baseline)
                </div>
                <div style={{ color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '6px 8px', borderRadius: '6px' }}>
                  🟠 <strong>Patia Main Road:</strong> AQI elevation (129.7 AQI)
                </div>
                <div style={{ color: '#38bdf8', background: 'rgba(6,182,212,0.1)', padding: '6px 8px', borderRadius: '6px' }}>
                  🔵 <strong>ML Engine:</strong> Real Scikit-learn inference active (250 records)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Copilot Trigger Button */}
        <button
          onClick={toggleCopilot}
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '8px',
            padding: '7px 14px',
            color: '#38bdf8',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.15)'
          }}
          id="top-nav-copilot-btn"
        >
          <Sparkles size={14} color="#06b6d4" />
          <span>✦ AI Copilot</span>
        </button>

        {/* User Profile Icon */}
        <div 
          style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 800
          }}
          title="Admin User"
        >
          AD
        </div>

        {/* Mobile Hamburger Drawer Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#f8fafc',
            cursor: 'pointer',
            padding: '4px',
            display: 'none'
          }}
          className="mobile-hamburger-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            background: '#0b0f17',
            borderBottom: '1px solid var(--border-color)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 110,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(17, 25, 35, 0.6)',
                  color: isActive ? '#06b6d4' : '#cbd5e1',
                  border: `1px solid ${isActive ? 'rgba(6, 182, 212, 0.4)' : 'transparent'}`,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
