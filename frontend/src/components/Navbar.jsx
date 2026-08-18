import React, { useState, useEffect } from 'react';
import { RefreshCw, Radio, Zap, Github, ExternalLink } from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';

export const Navbar = ({ title = 'Command Center' }) => {
  const { isBackendOnline, lastUpdated, triggerGlobalRefresh } = useUrbanPulseContext();
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    triggerGlobalRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'rgba(13, 19, 28, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #202B38',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Title & Live Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>{title}</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: isBackendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${isBackendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: isBackendOnline ? '#34d399' : '#fb7185',
          }}
        >
          <span className={`pulse-dot ${isBackendOnline ? 'online' : 'warning'}`} />
          {isBackendOnline ? '● AI ENGINE ONLINE' : '● SYSTEM OFFLINE'}
        </div>
      </div>

      {/* Control Actions & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* GitHub Repository Badge */}
        <a
          href="https://github.com/Saurav-Kumar-Nayak/URBANPULSE-AI"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(32, 43, 56, 0.6)',
            border: '1px solid #202B38',
            color: '#cbd5e1',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#06b6d4';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#202B38';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <Github size={15} />
          <span>GitHub</span>
          <ExternalLink size={12} style={{ opacity: 0.6 }} />
        </a>

        {/* Stream Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#94a3b8',
            backgroundColor: 'rgba(32, 43, 56, 0.5)',
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid #202B38',
          }}
        >
          <Radio size={14} color="#06b6d4" className="spin" />
          <span>Telemetry Stream Active</span>
        </div>

        {/* Real-time Clock */}
        <div
          style={{
            fontSize: '0.8rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#f8fafc',
            backgroundColor: '#111923',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #202B38',
          }}
        >
          {timeStr}
        </div>

        {/* Sync Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title={`Last synced at ${lastUpdated}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '6px',
            border: '1px solid #202B38',
            backgroundColor: '#111923',
            color: '#06b6d4',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          <span>Sync Data</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
