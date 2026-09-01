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
  LogOut,
  Radio,
  Lock
} from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isBackendOnline, 
    selectedZone,
    lastUpdated, 
    triggerGlobalRefresh,
    toggleCopilot,
    isAuthenticated,
    user,
    role,
    setIsLoginModalOpen,
    logout
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

  const publicNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'live-city', label: 'Live Map', icon: Map },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'pollution', label: 'Air Quality', icon: Wind },
    { id: 'weather', label: 'Weather', icon: CloudSun },
  ];

  const operatorNavItems = [
    { id: 'command-center', label: 'Command Center', icon: Activity },
    { id: 'live-city', label: 'Live Map', icon: Map },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'pollution', label: 'Air Quality', icon: Wind },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders },
  ];

  const navItems = isAuthenticated ? operatorNavItems : publicNavItems;

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
    <>
      <header className="top-nav-container" style={{ height: '60px', padding: '0 20px', background: '#090d16', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {/* LEFT: Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => handleNavClick('home')} 
            className="top-nav-brand"
            title="UrbanPulse AI Home"
            style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none' }}
          >
            <div className="top-nav-logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>
              <Activity size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div className="top-nav-title" style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.02em' }}>UrbanPulse AI</div>
              <div className="top-nav-subtitle" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                Smart City Operations Platform
              </div>
            </div>
          </button>
        </div>

        {/* CENTER: City Context & Live Monitored Zone */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '4px 14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.05em' }}>BHUBANESWAR</span>
            <span style={{ fontSize: '0.60rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.06em' }}>LIVE TELEMETRY</span>
          </div>
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
            <Radio size={12} color="#06b6d4" className="pulse-dot online" />
            <span>Zone: <strong style={{ color: '#f8fafc' }}>{selectedZone === 'ALL' || !selectedZone ? 'Patia Main Road' : selectedZone}</strong></span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="top-nav-links" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
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
                style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px' }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : '#94a3b8'} />
                <span>{item.id === 'command-center' ? 'Dashboard' : item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: System Controls & Operator Identity */}
        <div className="top-nav-actions">
          {/* System Online Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: isBackendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${isBackendOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
              fontSize: '0.70rem',
              fontWeight: 700,
              color: isBackendOnline ? '#34d399' : '#fb7185',
            }}
            title={isBackendOnline ? 'FastAPI Backend & SQLite connected' : 'Backend offline'}
          >
            <span className={`pulse-dot ${isBackendOnline ? 'online' : 'warning'}`} style={{ width: '6px', height: '6px' }} />
            <span>{isBackendOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
          </div>

          {/* Dynamic Time Wall Clock */}
          <div
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: '#cbd5e1',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            className="desktop-only"
          >
            {timeStr}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title={`Last updated ${lastUpdated}`}
            className="btn-subtle"
            style={{ padding: '5px 8px', borderRadius: '6px' }}
          >
            <RefreshCw size={13} className={refreshing ? 'spin' : ''} />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Operational Notifications"
            className="btn-subtle"
            style={{ padding: '5px 8px', borderRadius: '6px', position: 'relative' }}
          >
            <Bell size={13} />
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />
          </button>

          {/* Copilot Trigger (Operator Mode) */}
          {isAuthenticated && (
            <button
              onClick={toggleCopilot}
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '6px',
                padding: '4px 10px',
                color: '#38bdf8',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              id="top-nav-copilot-btn"
            >
              <Sparkles size={13} color="#38bdf8" />
              <span>Copilot</span>
            </button>
          )}

          {/* Operator Auth / Logout */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: role === 'ADMIN' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  border: `1px solid ${role === 'ADMIN' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                  color: role === 'ADMIN' ? '#c084fc' : '#38bdf8',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                <User size={12} />
                <span>{user?.name?.split(' ')[0] || role}</span>
              </div>

              <button
                onClick={logout}
                title="Logout session"
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  color: '#fb7185',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Lock size={12} />
              <span>Operator Login</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
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
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* THIN SYSTEM OPERATIONAL STATUS STRIP */}
      <div 
        style={{ 
          height: '24px', 
          background: '#070a10', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          padding: '0 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#34d399', fontWeight: 700 }}>● SYSTEM OPERATIONAL</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Connected: <strong style={{ color: '#cbd5e1' }}>SQLite (urbanpulse.db)</strong></span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>ML Engine: <strong style={{ color: '#38bdf8' }}>Online (Scikit-Learn)</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Telemetry: <strong style={{ color: '#34d399' }}>Live Telemetry Active</strong></span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Last Sync: <strong style={{ color: '#94a3b8' }}>{lastUpdated}</strong></span>
        </div>
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
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(17, 25, 35, 0.6)',
                  color: isActive ? '#38bdf8' : '#cbd5e1',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
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
    </>
  );
};

export default Navbar;
