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
  Sparkles, 
  RefreshCw, 
  Menu, 
  X, 
  User, 
  LogOut,
  Lock,
  ShieldCheck
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
    isAuthenticated,
    user,
    role,
    setIsLoginModalOpen,
    logout
  } = useUrbanPulseContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    <header className="top-nav-container" style={{
      background: '#0B1730',
      borderBottom: '1px solid rgba(120, 170, 255, 0.15)',
      padding: '0 20px',
      gap: '16px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }}>
      {/* LEFT: Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button 
          onClick={() => handleNavClick('home')} 
          className="top-nav-brand"
          title="UrbanPulse AI Home"
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1EA7FF 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(30, 167, 255, 0.3)'
          }}>
            <Activity size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              UrbanPulse AI
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#91A4C5', letterSpacing: '0.05em' }}>
              {isAuthenticated ? `${role} CONTROL ROOM` : 'MUNICIPAL TELEMETRY'}
            </div>
          </div>
        </button>
      </div>

      {/* CENTER: Navigation Tabs (Desktop & Tablet) */}
      <nav className="top-nav-links" style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0' }}>
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
              style={{
                background: isActive ? 'rgba(30, 167, 255, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(30, 167, 255, 0.4)' : '1px solid transparent',
                borderRadius: '8px',
                color: isActive ? '#20D9FF' : '#91A4C5',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} color={isActive ? '#20D9FF' : '#91A4C5'} />
              <span>{item.id === 'command-center' ? 'Dashboard' : item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RIGHT: Actions & Login Controls */}
      <div className="top-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        
        {/* Compact System Online Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: isBackendOnline ? 'rgba(39, 209, 127, 0.12)' : 'rgba(255, 90, 103, 0.12)',
            border: `1px solid ${isBackendOnline ? 'rgba(39, 209, 127, 0.35)' : 'rgba(255, 90, 103, 0.35)'}`,
            fontSize: '0.68rem',
            fontWeight: 800,
            color: isBackendOnline ? '#27D17F' : '#FF5A67',
            whiteSpace: 'nowrap'
          }}
          title={isBackendOnline ? 'FastAPI & Sensors Connected' : 'Backend Offline'}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isBackendOnline ? '#27D17F' : '#FF5A67',
            boxShadow: `0 0 6px ${isBackendOnline ? '#27D17F' : '#FF5A67'}`
          }} />
          <span>ONLINE</span>
        </div>

        {/* Refresh / Sync Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title={`Last synced: ${lastUpdated}`}
          style={{
            background: '#101E3A',
            border: '1px solid rgba(120, 170, 255, 0.2)',
            color: '#91A4C5',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}
        >
          <RefreshCw size={13} className={refreshing ? 'spin' : ''} />
        </button>

        {/* AI Copilot Trigger (Operator Only) */}
        {isAuthenticated && (
          <button
            onClick={toggleCopilot}
            style={{
              background: 'rgba(30, 167, 255, 0.15)',
              border: '1px solid rgba(30, 167, 255, 0.4)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#20D9FF',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap'
            }}
            id="top-nav-copilot-btn"
          >
            <Sparkles size={14} color="#20D9FF" />
            <span>AI Copilot</span>
          </button>
        )}

        {/* Distinct User Login & Operator Login Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          
          {/* USER LOGIN BUTTON */}
          <button
            onClick={() => handleNavClick('login')}
            title="Open Citizen User Login Page"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: activeTab === 'login' ? 'rgba(32, 217, 255, 0.2)' : 'rgba(16, 30, 58, 0.8)',
              border: '1px solid rgba(32, 217, 255, 0.4)',
              color: '#20D9FF',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            id="nav-user-login-btn"
          >
            <User size={13} />
            <span>User Login</span>
          </button>

          {/* OPERATOR LOGIN BUTTON */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            title="Open Municipal Operator Access Portal"
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1EA7FF 0%, #0284c7 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(30, 167, 255, 0.3)',
              transition: 'all 0.15s ease'
            }}
            id="nav-operator-login-btn"
          >
            <Lock size={13} />
            <span>Operator Login</span>
          </button>

          {/* Logged in User Profile & Logout */}
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '2px' }}>
              <button 
                onClick={() => handleNavClick('user-dashboard')}
                title="View Profile & Dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: role === 'ADMIN' ? 'rgba(124, 92, 255, 0.2)' : 'rgba(39, 209, 127, 0.2)',
                  border: `1px solid ${role === 'ADMIN' ? 'rgba(124, 92, 255, 0.4)' : 'rgba(39, 209, 127, 0.4)'}`,
                  color: role === 'ADMIN' ? '#7C5CFF' : '#27D17F',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                id="nav-profile-btn"
              >
                <ShieldCheck size={13} />
                <span>{user?.name?.split(' ')[0] || role}</span>
              </button>

              <button
                onClick={logout}
                title="Logout session"
                style={{
                  padding: '6px 8px',
                  borderRadius: '8px',
                  background: 'rgba(255, 90, 103, 0.12)',
                  border: '1px solid rgba(255, 90, 103, 0.3)',
                  color: '#FF5A67',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
                id="nav-logout-btn"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#F5F8FF',
            cursor: 'pointer',
            padding: '4px',
            display: 'none'
          }}
          className="mobile-hamburger-btn"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            background: '#0B1730',
            borderBottom: '1px solid rgba(120, 170, 255, 0.2)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 110,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <button
              onClick={() => handleNavClick('login')}
              style={{ padding: '10px', borderRadius: '8px', background: 'rgba(32, 217, 255, 0.15)', border: '1px solid rgba(32, 217, 255, 0.4)', color: '#20D9FF', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <User size={16} /> User Login
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setIsLoginModalOpen(true); }}
              style={{ padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, #1EA7FF, #0284c7)', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Lock size={16} /> Operator Login
            </button>
          </div>

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
                  backgroundColor: isActive ? 'rgba(30, 167, 255, 0.15)' : 'rgba(16, 30, 58, 0.6)',
                  color: isActive ? '#20D9FF' : '#91A4C5',
                  border: `1px solid ${isActive ? 'rgba(30, 167, 255, 0.4)' : 'transparent'}`,
                  fontWeight: 600,
                  fontSize: '0.88rem',
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
