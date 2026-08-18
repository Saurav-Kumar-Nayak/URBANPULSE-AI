import React from 'react';
import {
  LayoutDashboard,
  Map,
  Cpu,
  Navigation,
  CloudRain,
  AlertTriangle,
  BarChart3,
  Brain,
  MessageSquare,
  Settings,
  Activity,
  Code2
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuSections = [
    {
      title: 'COMMAND & CONTROL',
      items: [
        { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: 'Hero' },
        { id: 'live-city', label: 'Live City Map', icon: Map, badge: 'Live' },
      ],
    },
    {
      title: 'PREDICTIVE INTELLIGENCE',
      items: [
        { id: 'predictions', label: 'AI Predictions', icon: Cpu, badge: 'ML' },
        { id: 'traffic', label: 'Traffic Intelligence', icon: Navigation },
        { id: 'environment', label: 'Environmental AI', icon: CloudRain },
        { id: 'risk', label: 'Risk & Anomalies', icon: AlertTriangle, badge: 'Radar' },
      ],
    },
    {
      title: 'ANALYTICS & COPILOT',
      items: [
        { id: 'analytics', label: 'Analytics Workspace', icon: BarChart3 },
        { id: 'ml-models', label: 'ML Model Center', icon: Brain },
        { id: 'ai-copilot', label: 'AI Copilot', icon: MessageSquare, badge: 'AI' },
      ],
    },
    {
      title: 'DEVELOPER & SYSTEM',
      items: [
        { id: 'api-docs', label: 'API Reference', icon: Code2 },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0D131C',
        borderRight: '1px solid #202B38',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #202B38',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
          }}
        >
          <Activity size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            URBANPULSE <span style={{ color: '#06b6d4' }}>AI</span>
          </h2>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
            Urban Predictive Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {menuSections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                paddingLeft: '10px',
              }}
            >
              {section.title}
            </h4>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    marginBottom: '3px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    color: isActive ? '#06b6d4' : '#94a3b8',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color={isActive ? '#06b6d4' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'rgba(6, 182, 212, 0.2)' : 'rgba(32, 43, 56, 0.6)',
                        color: isActive ? '#38bdf8' : '#64748b',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Status */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #202B38',
          fontSize: '0.74rem',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Engine v1.0.0</span>
        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="pulse-dot online" /> Connected
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
