import React from 'react';
import { MapPin, ChevronDown, Map, Download, RefreshCw, Activity } from 'lucide-react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const PollutionHeader = ({ 
  selectedLocation, 
  onLocationChange, 
  locations = [], 
  onRefresh, 
  isRefreshing 
}) => {
  const { setActiveTab } = useUrbanPulseContext();

  const handleExportReport = () => {
    alert("Generating Municipal Environmental Report (PDF)...\nData downloaded for Saheed Nagar & Bhubaneswar Metro.");
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      background: '#0B1730',
      border: '1px solid rgba(120, 170, 255, 0.18)',
      borderRadius: '14px',
      padding: '16px 20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
    }}>
      {/* Title & Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(32, 217, 255, 0.12)',
              border: '1px solid rgba(32, 217, 255, 0.3)',
              color: '#20D9FF',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.06em'
            }}>
              REAL-TIME
            </span>
            <span style={{ fontSize: '0.75rem', color: '#91A4C5', fontWeight: 600 }}>
              MUNICIPAL TELEMETRY
            </span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#F5F8FF', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>
            Environmental & AQI Intelligence
          </h1>
        </div>

        {/* Location Dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#101E3A',
            border: '1px solid rgba(120, 170, 255, 0.25)',
            borderRadius: '10px',
            padding: '8px 14px',
            color: '#F5F8FF',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            <MapPin size={16} color="#1EA7FF" />
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F5F8FF',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '12px'
              }}
            >
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <option key={loc.location_id || loc.id || loc.name} value={loc.name || loc.location_name} style={{ background: '#0B1730', color: '#F5F8FF' }}>
                    {loc.name || loc.location_name}
                  </option>
                ))
              ) : (
                <>
                  <option value="Saheed Nagar, Bhubaneswar" style={{ background: '#0B1730', color: '#F5F8FF' }}>Saheed Nagar, Bhubaneswar</option>
                  <option value="Patia, Bhubaneswar" style={{ background: '#0B1730', color: '#F5F8FF' }}>Patia, Bhubaneswar</option>
                  <option value="Master Canteen, Bhubaneswar" style={{ background: '#0B1730', color: '#F5F8FF' }}>Master Canteen, Bhubaneswar</option>
                  <option value="Jaydev Vihar, Bhubaneswar" style={{ background: '#0B1730', color: '#F5F8FF' }}>Jaydev Vihar, Bhubaneswar</option>
                  <option value="Khandagiri, Bhubaneswar" style={{ background: '#0B1730', color: '#F5F8FF' }}>Khandagiri, Bhubaneswar</option>
                  <option value="Old Town, Bhubaneswar" style={{ background: '#0B1730', color: '#F5F8FF' }}>Old Town, Bhubaneswar</option>
                </>
              )}
            </select>
            <ChevronDown size={14} color="#91A4C5" style={{ pointerEvents: 'none', marginLeft: '-8px' }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            background: 'rgba(16, 30, 58, 0.8)',
            border: '1px solid rgba(120, 170, 255, 0.2)',
            borderRadius: '10px',
            color: '#F5F8FF',
            padding: '9px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Refresh Data"
        >
          <RefreshCw size={15} color="#20D9FF" className={isRefreshing ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={() => setActiveTab('live-city')}
          style={{
            background: 'linear-gradient(135deg, #1EA7FF 0%, #0284c7 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            padding: '9px 16px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(30, 167, 255, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <Map size={15} />
          <span>View on Map</span>
        </button>

        <button
          onClick={handleExportReport}
          style={{
            background: '#101E3A',
            border: '1px solid rgba(120, 170, 255, 0.25)',
            borderRadius: '10px',
            color: '#F5F8FF',
            padding: '9px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Download size={15} color="#91A4C5" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
};

export default PollutionHeader;
