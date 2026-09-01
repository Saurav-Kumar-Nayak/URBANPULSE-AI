import React from 'react';
import { Map, ArrowRight } from 'lucide-react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const MapCTA = () => {
  const { setActiveTab } = useUrbanPulseContext();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0B1730 0%, #101E3A 100%)',
      border: '1px solid rgba(32, 217, 255, 0.3)',
      borderRadius: '14px',
      padding: '24px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(32, 217, 255, 0.12)',
          border: '1px solid rgba(32, 217, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}>
          <Map size={24} color="#20D9FF" />
        </div>

        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F5F8FF', margin: 0 }}>
            Explore Air Quality Across Bhubaneswar
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#91A4C5', margin: '4px 0 0 0' }}>
            Inspect real-time spatial air quality heatmaps and sensor node telemetry on the interactive 3D digital twin map.
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('live-city')}
        style={{
          background: 'linear-gradient(135deg, #1EA7FF 0%, #0284c7 100%)',
          border: 'none',
          borderRadius: '10px',
          color: '#ffffff',
          padding: '12px 20px',
          fontSize: '0.88rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(30, 167, 255, 0.4)',
          transition: 'all 0.2s ease'
        }}
      >
        <span>Open Live Map</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default MapCTA;
