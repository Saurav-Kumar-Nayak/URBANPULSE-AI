import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import WhatIfSimulatorWidget from '../components/dashboard/WhatIfSimulatorWidget';
import { Sliders, Cpu, Activity, AlertTriangle } from 'lucide-react';

export const WhatIfSimulator = () => {
  return (
    <PageContainer
      title="WHAT-IF URBAN SIMULATOR"
      subtitle="Interactive Municipal Scenario Modeling & Predictive Risk Assessment Engine"
      badge={<Badge variant="cyan">AI Scenario Studio</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <WhatIfSimulatorWidget />

        {/* Scenario Templates Grid */}
        <div className="card-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#06b6d4" /> Pre-Configured Municipal Scenario Stress Tests
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: 'rgba(13,19,28,0.8)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                🌧 severe Storm & Commute Surge
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Simulates Heavy Rain weather combined with +35% traffic density along major arterial bridges.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 700 }}>
                Est. Risk: HIGH (Delay +18m)
              </div>
            </div>

            <div style={{ background: 'rgba(13,19,28,0.8)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                🏭 Industrial Emission Deterioration
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Simulates +60% AQI spike in Harbor Industrial district with stagnant low wind speed.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>
                Est. Risk: MODERATE (AQI 142)
              </div>
            </div>

            <div style={{ background: 'rgba(13,19,28,0.8)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                🚌 Green Transit Diversion
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Simulates -25% traffic reduction via electric bus prioritization during peak hours.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                Est. Risk: LOW (Speed +12km/h)
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WhatIfSimulator;
