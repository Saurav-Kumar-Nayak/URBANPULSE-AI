import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldAlert, Wind, Car, Info } from 'lucide-react';

export default function LiveCityMap({ locations = [], anomalies = [], selectedZone, onSelectZone }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [activeLayer, setActiveLayer] = useState('all'); // 'all', 'traffic', 'pollution', 'risk'

  const defaultCenter = [40.730610, -73.935242]; // New York Metropolitan Area

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: true
      });

      // Dark Matter Map Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> Dark Matter',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => map.removeLayer(marker));
    markersRef.current = {};

    // Default fallback location markers if API is loading
    const zonesToRender = locations.length > 0 ? locations : [
      { location_id: "LOC-01", location_name: "Downtown Central", latitude: 40.7128, longitude: -74.0060, congestion_index: 0.72, aqi: 85, risk_score: 68.5, is_anomaly: true },
      { location_id: "LOC-02", location_name: "Midtown Financial", latitude: 40.7589, longitude: -73.9851, congestion_index: 0.84, aqi: 92, risk_score: 78.0, is_anomaly: true },
      { location_id: "LOC-03", location_name: "Harbor Industrial", latitude: 40.6720, longitude: -74.0090, congestion_index: 0.58, aqi: 128, risk_score: 72.4, is_anomaly: true },
      { location_id: "LOC-04", location_name: "Tech Corridor West", latitude: 40.7410, longitude: -74.0040, congestion_index: 0.45, aqi: 52, risk_score: 38.0, is_anomaly: false },
      { location_id: "LOC-05", location_name: "North Residential", latitude: 40.7900, longitude: -73.9600, congestion_index: 0.32, aqi: 42, risk_score: 28.5, is_anomaly: false },
      { location_id: "LOC-06", location_name: "Suburb South Ridge", latitude: 40.6300, longitude: -74.0800, congestion_index: 0.22, aqi: 35, risk_score: 18.0, is_anomaly: false },
      { location_id: "LOC-07", location_name: "Airport Transit Hub", latitude: 40.6413, longitude: -73.7781, congestion_index: 0.76, aqi: 104, risk_score: 74.2, is_anomaly: true },
      { location_id: "LOC-08", location_name: "University District", latitude: 40.7290, longitude: -73.9960, congestion_index: 0.48, aqi: 58, risk_score: 42.0, is_anomaly: false }
    ];

    zonesToRender.forEach(zone => {
      const isSelected = selectedZone === zone.location_id;
      const isAnom = zone.is_anomaly;

      let pinColor = '#06b6d4'; // Cyan default
      if (activeLayer === 'traffic') {
        pinColor = zone.congestion_index > 0.7 ? '#f43f5e' : (zone.congestion_index > 0.4 ? '#f59e0b' : '#10b981');
      } else if (activeLayer === 'pollution') {
        pinColor = zone.aqi > 100 ? '#f43f5e' : (zone.aqi > 60 ? '#f59e0b' : '#10b981');
      } else if (activeLayer === 'risk' || isAnom) {
        pinColor = zone.risk_score > 70 ? '#f43f5e' : (zone.risk_score > 45 ? '#f59e0b' : '#06b6d4');
      }

      const customHtml = `
        <div className="custom-map-marker" style="
          background-color: ${pinColor};
          width: ${isSelected ? '28px' : '22px'};
          height: ${isSelected ? '28px' : '22px'};
          border-radius: 50%;
          border: 3px solid rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 14px ${pinColor};
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${isAnom ? '<div style="width:8px;height:8px;background:#fff;border-radius:50%"></div>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'leaflet-custom-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([zone.latitude, zone.longitude], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: Inter, sans-serif; color: #f8fafc; padding: 4px;">
          <div style="font-weight: 700; font-size: 0.95rem; color: #38bdf8; margin-bottom: 6px;">
            ${zone.location_name}
          </div>
          <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px;">
            <div>Congestion: <strong style="color: ${zone.congestion_index > 0.7 ? '#f43f5e' : '#10b981'}">${Math.round(zone.congestion_index * 100)}%</strong></div>
            <div>AQI Level: <strong style="color: ${zone.aqi > 100 ? '#f43f5e' : '#10b981'}">${zone.aqi} AQI</strong></div>
            <div>Urban Risk Score: <strong style="color: #f59e0b">${zone.risk_score} / 100</strong></div>
            <div>Status: <span style="color: ${isAnom ? '#f43f5e' : '#10b981'}">${isAnom ? '⚠️ Anomaly Detected' : 'Optimal'}</span></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectZone) onSelectZone(zone.location_id);
      });

      markersRef.current[zone.location_id] = marker;
    });

  }, [locations, selectedZone, activeLayer]);

  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--primary-cyan)" />
            Interactive Urban Spatial Telemetry Map
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time geospatial overlay of congestion bottlenecks, AQI hotspots, and AI anomaly clusters
          </p>
        </div>

        {/* Layer Controls */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(15,23,42,0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveLayer('all')}
            className={`btn-subtle ${activeLayer === 'all' ? 'active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            All Metrics
          </button>
          <button 
            onClick={() => setActiveLayer('traffic')}
            className={`btn-subtle ${activeLayer === 'traffic' ? 'active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Traffic Layer
          </button>
          <button 
            onClick={() => setActiveLayer('pollution')}
            className={`btn-subtle ${activeLayer === 'pollution' ? 'active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Pollution Layer
          </button>
          <button 
            onClick={() => setActiveLayer('risk')}
            className={`btn-subtle ${activeLayer === 'risk' ? 'active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Risk Hotspots
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: '420px', 
          width: '100%', 
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          zIndex: 1
        }}
      />
    </div>
  );
}
