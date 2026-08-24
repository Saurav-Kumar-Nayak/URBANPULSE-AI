import React from 'react';
import Navbar from '../Navbar';
import AICopilotDrawer from '../dashboard/AICopilotDrawer';
import LoginModal from '../ui/LoginModal';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';
import { Sparkles } from 'lucide-react';

export const AppLayout = ({ children }) => {
  const { activeTab, toggleCopilot, isAuthenticated } = useUrbanPulseContext();
  const isHome = activeTab === 'home';

  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: '#070b12', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Command Navigation (Hidden on Landing Page to prevent duplicate navbar) */}
      {!isHome && <Navbar />}

      {/* Main Content Area */}
      <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={isHome ? { flex: 1, width: '100%', padding: 0 } : { flex: 1, padding: '24px', maxWidth: '1800px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Global Floating AI Copilot Trigger Button (Shown on telemetry dashboard pages when operator is authenticated) */}
      {!isHome && isAuthenticated && (
        <button
          onClick={toggleCopilot}
          className="copilot-floating-btn"
          id="global-floating-copilot-trigger"
        >
          <Sparkles size={18} />
          <span>✦ UrbanPulse AI</span>
        </button>
      )}

      {/* Slide-out AI Copilot Drawer */}
      <AICopilotDrawer />

      {/* Global Operator Login Modal */}
      <LoginModal />
    </div>
  );
};

export default AppLayout;
