import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Layers, 
  Camera, 
  AlertTriangle, 
  HardHat, 
  CloudSun,
  MapPin,
  Maximize2
} from 'lucide-react';
import ZoneInspectorModal from './dashboard/ZoneInspectorModal';

const BHUBANESWAR_ZONES = [
  { id: 'LOC-01', name: 'Patia', lat: 20.3588, lng: 85.8184, x: 48, y: 38, speed: 28, aqi: 72, health: 84, risk: 'Low Risk', temp: '32°C', population: '142K', areaSqKm: '18', sensorNodes: 12, dataSources: '32+', alertsCount: 1 },
  { id: 'LOC-02', name: 'Jayadev Vihar', lat: 20.2980, lng: 85.8245, x: 16, y: 27, speed: 22, aqi: 88, health: 76, risk: 'Medium Risk', temp: '33°C', population: '115K', areaSqKm: '14', sensorNodes: 10, dataSources: '28+', alertsCount: 2 },
  { id: 'LOC-03', name: 'Saheed Nagar', lat: 20.2885, lng: 85.8420, x: 26, y: 12, speed: 18, aqi: 110, health: 68, risk: 'High Risk', temp: '34°C', population: '98K', areaSqKm: '12', sensorNodes: 14, dataSources: '40+', alertsCount: 4 },
  { id: 'LOC-04', name: 'Khandagiri', lat: 20.2600, lng: 85.7850, x: 18, y: 68, speed: 34, aqi: 54, health: 90, risk: 'Optimal', temp: '31°C', population: '105K', areaSqKm: '22', sensorNodes: 8, dataSources: '20+', alertsCount: 0 },
  { id: 'LOC-05', name: 'Vani Vihar', lat: 20.2910, lng: 85.8580, x: 84, y: 28, speed: 26, aqi: 82, health: 80, risk: 'Low Risk', temp: '32°C', population: '78K', areaSqKm: '15', sensorNodes: 9, dataSources: '24+', alertsCount: 1 },
  { id: 'LOC-06', name: 'Bhubaneswar Railway Station', lat: 20.2650, lng: 85.8400, x: 38, y: 28, speed: 14, aqi: 128, health: 62, risk: 'High Risk', temp: '35°C', population: '88K', areaSqKm: '10', sensorNodes: 16, dataSources: '45+', alertsCount: 5 },
  { id: 'LOC-07', name: 'Nandankanan Road', lat: 20.3700, lng: 85.8300, x: 62, y: 12, speed: 30, aqi: 65, health: 86, risk: 'Low Risk', temp: '31°C', population: '52K', areaSqKm: '25', sensorNodes: 6, dataSources: '18+', alertsCount: 0 },
  { id: 'LOC-08', name: 'KIIT University', lat: 20.3530, lng: 85.8150, x: 74, y: 53, speed: 32, aqi: 58, health: 88, risk: 'Optimal', temp: '31°C', population: '65K', areaSqKm: '16', sensorNodes: 11, dataSources: '30+', alertsCount: 0 }
];

export default function LiveCityMap({ locations = [], selectedZone = "LOC-01", onSelectZone, mapHeight = '520px', userLocation = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const imageContainerRef = useRef(null);
  
  const [mapMode, setMapMode] = useState('3d'); // '3d' | 'live' | 'satellite'
  const [showInspector, setShowInspector] = useState(false);
  
  // Pin position state (default to Patia x: 48%, y: 38%)
  const [activePin, setActivePin] = useState({
    name: 'Patia',
    x: 48,
    y: 38,
    lat: 20.3588,
    lng: 85.8184,
    speed: 28,
    aqi: 72,
    health: 84,
    risk: 'Low Risk',
    population: '142K',
    areaSqKm: '18',
    sensorNodes: 12,
    dataSources: '32+',
    alertsCount: 1,
    isUserLocation: false
  });

  const [hoveredZone, setHoveredZone] = useState(null);

  // Dynamic 3D & Geospatial Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = (e) => {
    if (e) e.stopPropagation();
    if (mapMode === '3d') {
      setZoomLevel(prev => Math.min(2.8, +(prev + 0.25).toFixed(2)));
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = (e) => {
    if (e) e.stopPropagation();
    if (mapMode === '3d') {
      setZoomLevel(prev => {
        const next = Math.max(1.0, +(prev - 0.25).toFixed(2));
        if (next === 1.0) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetZoom = (e) => {
    if (e) e.stopPropagation();
    if (mapMode === '3d') {
      setZoomLevel(1.0);
      setPanOffset({ x: 0, y: 0 });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(13);
    }
  };

  const handle3dWheel = (e) => {
    if (mapMode !== '3d') return;
    if (e.deltaY < 0) {
      setZoomLevel(prev => Math.min(2.8, +(prev + 0.15).toFixed(2)));
    } else {
      setZoomLevel(prev => {
        const next = Math.max(1.0, +(prev - 0.15).toFixed(2));
        if (next === 1.0) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1.0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1.0) {
      const maxPan = (zoomLevel - 1) * 220;
      const newX = Math.max(-maxPan, Math.min(maxPan, e.clientX - dragStart.x));
      const newY = Math.max(-maxPan, Math.min(maxPan, e.clientY - dragStart.y));
      setPanOffset({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Sync when selectedZone prop changes from external component click
  useEffect(() => {
    if (selectedZone) {
      const found = BHUBANESWAR_ZONES.find(z => z.id === selectedZone || z.name === selectedZone || z.name === selectedZone?.name);
      if (found) {
        setActivePin({ ...found, isUserLocation: false });
      } else if (typeof selectedZone === 'object' && selectedZone.name) {
        setActivePin({ ...selectedZone, isUserLocation: false });
      }
    }
  }, [selectedZone]);

  // Sync when userLocation prop changes from "Detect My Location" button
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      const userPin = {
        name: userLocation.area || userLocation.city || "Detected Location",
        x: 48, // Centered pulse over detected zone
        y: 42,
        lat: parseFloat(userLocation.lat),
        lng: parseFloat(userLocation.lng),
        speed: 29,
        aqi: 70,
        health: 85,
        risk: 'Low Risk',
        population: '968K',
        areaSqKm: '176',
        sensorNodes: 52,
        dataSources: '128+',
        alertsCount: 3,
        isUserLocation: true
      };

      setActivePin(userPin);

      if (onSelectZone) {
        onSelectZone(userPin);
      }
    }
  }, [userLocation]);

  // Leaflet map setup for 'live' or 'satellite' mode
  useEffect(() => {
    if (mapMode === 'live' || mapMode === 'satellite') {
      if (!mapContainerRef.current) return;

      const center = [activePin.lat || 20.2961, activePin.lng || 85.8245];

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: 13,
          zoomControl: false
        });

        const tileUrl = mapMode === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: '&copy; CARTO / OpenStreetMap',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      } else if (tileLayerRef.current) {
        const tileUrl = mapMode === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        tileLayerRef.current.setUrl(tileUrl);
        mapInstanceRef.current.setView(center, 13);
      }

      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [mapMode, activePin]);

  // Handle clicking ANYWHERE on the 3D map canvas
  const handleMapClick = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked close to a known zone
    const closest = BHUBANESWAR_ZONES.find(z => 
      Math.abs(z.x - clickX) < 12 && Math.abs(z.y - clickY) < 12
    );

    if (closest) {
      const updated = { ...closest, isUserLocation: false };
      setActivePin(updated);
      if (onSelectZone) onSelectZone(closest);
    } else {
      // Custom clicked point coordinates based on Bhubaneswar bounding box
      const calcLat = (20.37 - (clickY / 100) * 0.12).toFixed(4);
      const calcLng = (85.78 + (clickX / 100) * 0.10).toFixed(4);
      const customPin = {
        name: `Monitored Zone (${calcLat}° N)`,
        x: clickX,
        y: clickY,
        lat: parseFloat(calcLat),
        lng: parseFloat(calcLng),
        speed: Math.floor(22 + (Math.abs(Math.sin(parseFloat(calcLat) * 100)) * 12)),
        aqi: Math.floor(55 + (Math.abs(Math.cos(parseFloat(calcLng) * 100)) * 45)),
        health: Math.floor(80 + (Math.abs(Math.sin(parseFloat(calcLat) * 50)) * 15)),
        risk: 'Monitored Zone',
        population: '85K',
        areaSqKm: '12',
        sensorNodes: 8,
        dataSources: '18+',
        alertsCount: 1,
        isUserLocation: false
      };
      setActivePin(customPin);
      if (onSelectZone) onSelectZone(customPin);
    }
  };

  return (
    <div 
      className="card-panel map-container-3d" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: mapHeight, 
        borderRadius: '16px', 
        overflow: 'hidden',
        isolation: 'isolate',
        zIndex: 1,
        border: '1px solid rgba(6, 182, 212, 0.3)',
        background: '#070b12',
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
      }}
    >
      {/* 3D STREET LEVEL ZONE INSPECTOR MODAL */}
      {showInspector && (
        <ZoneInspectorModal zone={activePin} onClose={() => setShowInspector(false)} />
      )}

      {/* 1. TOP LEFT PILL MODE SWITCHER */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '14px', 
          left: '14px', 
          zIndex: 20, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          background: 'rgba(11, 15, 23, 0.88)',
          padding: '4px',
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <button
          onClick={() => setMapMode('3d')}
          style={{
            background: mapMode === '3d' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: mapMode === '3d' ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={13} />
          <span>3D Digital Twin</span>
        </button>

        <button
          onClick={() => setMapMode('live')}
          style={{
            background: mapMode === 'live' ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
            color: mapMode === 'live' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <MapPin size={13} />
          <span>Live Map</span>
        </button>

        <button
          onClick={() => setMapMode('satellite')}
          style={{
            background: mapMode === 'satellite' ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
            color: mapMode === 'satellite' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Satellite</span>
        </button>
      </div>

      {/* 2. TOP RIGHT FLOATING 3D CONTROLS */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '14px', 
          right: '14px', 
          zIndex: 20, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px',
          background: 'rgba(11, 15, 23, 0.90)',
          padding: '5px',
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'none', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
          title="Zoom In (+)"
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <ZoomIn size={16} />
        </button>

        {/* Dynamic Zoom Level Percentage Indicator & Reset Button */}
        <button
          onClick={handleResetZoom}
          title="Reset Zoom to 100%"
          style={{
            background: zoomLevel > 1.0 ? 'rgba(6, 182, 212, 0.25)' : 'none',
            border: zoomLevel > 1.0 ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
            borderRadius: '4px',
            color: zoomLevel > 1.0 ? '#38bdf8' : '#94a3b8',
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '2px 0',
            cursor: 'pointer',
            textAlign: 'center',
            width: '32px'
          }}
        >
          {Math.round(zoomLevel * 100)}%
        </button>

        <button
          onClick={handleZoomOut}
          style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'none', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
          title="Zoom Out (-)"
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <ZoomOut size={16} />
        </button>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2px 0' }} />
        <button
          onClick={() => setShowInspector(true)}
          style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.2)', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Inspect Street Camera View"
        >
          <Camera size={16} />
        </button>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2px 0' }} />
        <button
          onClick={() => setMapMode('3d')}
          style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'none', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="3D Tilt View"
        >
          3D
        </button>
      </div>

      {/* 3. MAIN MAP DISPLAY AREA (DYNAMIC ZOOM & PAN IN 3D MODE) */}
      {mapMode === '3d' ? (
        <div 
          ref={imageContainerRef}
          onClick={handleMapClick}
          onWheel={handle3dWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            overflow: 'hidden', 
            cursor: isDragging ? 'grabbing' : (zoomLevel > 1.0 ? 'grab' : 'crosshair') 
          }}
        >
          {/* ZOOM & PAN SCALABLE CANVAS CONTAINER */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform'
            }}
          >
            {/* SVG SHARPENING FILTER FOR 100% CLEAR ROADS, WATER BODIES & BUILDINGS */}
            <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
              <filter id="urbanMapSharpen">
                <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="0 -0.6 0 -0.6 3.4 -0.6 0 -0.6 0" />
              </filter>
            </svg>

            {/* HIGH-RES 3D ISOMETRIC CITY VISUALIZATION WITH ULTRA-SHARP LINES & CLEAR WATER */}
            <img 
              src="/bhubaneswar_3d_twin.jpg" 
              alt="Bhubaneswar 3D Digital Twin Command Map" 
              style={{ 
                width: '100%', 
                height: 'calc(100% - 42px)', 
                objectFit: 'cover',
                objectPosition: 'center top',
                imageRendering: '-webkit-optimize-contrast',
                filter: 'url(#urbanMapSharpen) contrast(1.22) saturate(1.28) brightness(1.04)',
                willChange: 'filter, transform'
              }} 
            />

            {/* CRISP FLOATING 3D AREA NAME BADGES & INTERACTIVE HOTSPOTS OVER ALL LOCATIONS */}
            {BHUBANESWAR_ZONES.map((zone, idx) => {
              const isActive = activePin.name === zone.name || activePin.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = { ...zone, isUserLocation: false };
                    setActivePin(updated);
                    if (onSelectZone) onSelectZone(updated);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setShowInspector(true);
                  }}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{
                    position: 'absolute',
                    top: `${zone.y}%`,
                    left: `${zone.x}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isActive ? 15 : 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {!isActive && (
                    <div 
                      className="crisp-area-badge crisp-area-badge-floating" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        animationDelay: `${idx * 0.35}s` 
                      }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: zone.risk === 'High Risk' ? '#f43f5e' : (zone.risk === 'Medium Risk' ? '#f59e0b' : '#34d399'), boxShadow: '0 0 6px currentColor' }} />
                      <span>{zone.name}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* REAL 3D FLOATING RADAR CIRCLE + FLOATING MARKER PIN */}
            <div 
              style={{ 
                position: 'absolute', 
                top: `${activePin.y}%`, 
                left: `${activePin.x}%`, 
                transform: 'translate(-50%, -50%)', 
                pointerEvents: 'none',
                zIndex: 10,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* REAL-LIKE 3D FLOATING RADAR CIRCLE */}
              <div 
                className={activePin.isUserLocation ? "radar-circle-floating-gps" : "radar-circle-floating"}
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  width: '180px', 
                  height: '110px', 
                  borderRadius: '50%', 
                  background: activePin.isUserLocation
                    ? 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.45) 0%, rgba(52, 211, 153, 0.15) 60%, rgba(52, 211, 153, 0) 100%)'
                    : 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.45) 0%, rgba(59, 130, 246, 0.15) 60%, rgba(59, 130, 246, 0) 100%)',
                  border: activePin.isUserLocation ? '1.8px dashed rgba(52, 211, 153, 0.85)' : '1.8px dashed rgba(56, 189, 248, 0.85)',
                  boxShadow: activePin.isUserLocation ? '0 0 35px rgba(52, 211, 153, 0.7)' : '0 0 35px rgba(56, 189, 248, 0.7)',
                  pointerEvents: 'none'
                }} 
              />

              {/* FLOATING LIVE TELEMETRY BADGE & PIN BOBBING IN 3D SPACE */}
              <div className="pin-floating-bob" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  style={{ 
                    background: activePin.isUserLocation ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
                    color: '#ffffff', 
                    padding: '5px 14px', 
                    borderRadius: '10px', 
                    fontSize: '0.80rem', 
                    fontWeight: 800, 
                    boxShadow: '0 6px 20px rgba(0,0,0,0.7), 0 0 15px rgba(56, 189, 248, 0.4)', 
                    border: '1px solid rgba(255,255,255,0.45)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    pointerEvents: 'auto',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInspector(true);
                  }}
                >
                  <span>{activePin.isUserLocation ? "📍 " + activePin.name : activePin.name}</span>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(0,0,0,0.35)', padding: '2px 7px', borderRadius: '5px', fontWeight: 700 }}>
                    {activePin.speed} km/h • {activePin.aqi} AQI
                  </span>
                  <Maximize2 size={12} color="#ffffff" style={{ marginLeft: '2px' }} />
                </div>

                {/* Glowing Map Pin Icon */}
                <div style={{ width: '30px', height: '38px', marginTop: '2px', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.9))' }}>
                  <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill={activePin.isUserLocation ? '#10b981' : '#3b82f6'}/>
                    <circle cx="12" cy="12" r="5" fill="#ffffff"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover Tooltip when mouse hovers a zone */}
            {hoveredZone && (
              <div 
                style={{
                  position: 'absolute',
                  top: `${hoveredZone.y - 12}%`,
                  left: `${hoveredZone.x}%`,
                  transform: 'translateX(-50%)',
                  background: 'rgba(13, 19, 28, 0.95)',
                  border: '1px solid #38bdf8',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#38bdf8',
                  fontSize: '0.70rem',
                  fontWeight: 700,
                  pointerEvents: 'none',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
              >
                Click or Double-Click to inspect {hoveredZone.name}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LEAFLET INTERACTIVE CONTAINER */
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      )}

      {/* 4. BOTTOM MAP LEGEND OVERLAY BAR (SOLID OPAQUE - NO DUPLICATE / OVERLAPPED TEXT) */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          right: '0', 
          zIndex: 20, 
          background: '#070b12', 
          borderTop: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '0 0 16px 16px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          fontWeight: 700,
          boxShadow: '0 -6px 20px rgba(0,0,0,0.8)',
          overflowX: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={() => {
              const lowZone = BHUBANESWAR_ZONES.find(z => z.risk === 'Low Risk');
              if (lowZone) setActivePin({ ...lowZone, isUserLocation: false });
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}
            title="Highlight Smooth Zones"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span>Smooth</span>
          </button>

          <button 
            onClick={() => {
              const medZone = BHUBANESWAR_ZONES.find(z => z.risk === 'Medium Risk' || z.risk === 'Moderate');
              if (medZone) setActivePin({ ...medZone, isUserLocation: false });
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}
            title="Highlight Moderate Zones"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span>Moderate</span>
          </button>

          <button 
            onClick={() => {
              const heavyZone = BHUBANESWAR_ZONES.find(z => z.name.includes('Station') || z.speed < 20);
              if (heavyZone) setActivePin({ ...heavyZone, isUserLocation: false });
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}
            title="Highlight Heavy Traffic Zones"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316', boxShadow: '0 0 6px #f97316' }} />
            <span>Heavy</span>
          </button>

          <button 
            onClick={() => {
              const highZone = BHUBANESWAR_ZONES.find(z => z.risk === 'High Risk');
              if (highZone) setActivePin({ ...highZone, isUserLocation: false });
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}
            title="Highlight Severe Risk Zones"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 6px #f43f5e' }} />
            <span>Severe</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#94a3b8' }}>
          <button 
            onClick={() => setShowInspector(true)}
            style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}
            title="Open Live Traffic Camera Inspector"
          >
            <Camera size={14} />
            <span>Traffic Camera</span>
          </button>

          <button 
            onClick={() => {
              const incidentZone = BHUBANESWAR_ZONES.find(z => z.risk === 'High Risk');
              if (incidentZone) setActivePin({ ...incidentZone, isUserLocation: false });
            }}
            style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}
            title="Inspect Active Incidents"
          >
            <AlertTriangle size={14} />
            <span>Incident</span>
          </button>

          <button 
            onClick={() => {
              const constZone = BHUBANESWAR_ZONES.find(z => z.name.includes('Patia'));
              if (constZone) setActivePin({ ...constZone, isUserLocation: false });
            }}
            style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}
            title="Inspect Construction Workzones"
          >
            <HardHat size={14} />
            <span>Construction</span>
          </button>

          <button 
            onClick={() => {
              const wxZone = BHUBANESWAR_ZONES.find(z => z.name.includes('KIIT'));
              if (wxZone) setActivePin({ ...wxZone, isUserLocation: false });
            }}
            style={{ background: 'rgba(192, 132, 252, 0.12)', border: '1px solid rgba(192, 132, 252, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}
            title="Inspect Weather Sensors"
          >
            <CloudSun size={14} />
            <span>Weather Station</span>
          </button>
        </div>
      </div>
    </div>
  );
}
