import React, { useState, useEffect, useRef } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  Car, 
  Gauge, 
  Activity, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Layers, 
  Compass, 
  Plus, 
  Minus, 
  Search, 
  X, 
  CheckCircle2, 
  Radio, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Camera
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CITY_PRESETS = [
  { city: 'Bhubaneswar', region: 'Odisha', country: 'India', lat: 20.2961, lng: 85.8245, vehicles: '18,247', congestion: 0.68, avgSpeed: 24.7, flow: '72%', incidents: 7 },
  { city: 'New Delhi', region: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, vehicles: '42,190', congestion: 0.84, avgSpeed: 18.2, flow: '54%', incidents: 14 },
  { city: 'Mumbai', region: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, vehicles: '38,650', congestion: 0.79, avgSpeed: 19.5, flow: '58%', incidents: 11 },
  { city: 'London', region: 'Greater London', country: 'UK', lat: 51.5074, lng: -0.1278, vehicles: '24,110', congestion: 0.52, avgSpeed: 28.4, flow: '81%', incidents: 4 },
  { city: 'New York', region: 'NY', country: 'USA', lat: 40.7128, lng: -74.0060, vehicles: '35,820', congestion: 0.74, avgSpeed: 21.0, flow: '64%', incidents: 9 },
  { city: 'Tokyo', region: 'Kanto', country: 'Japan', lat: 35.6762, lng: 139.6503, vehicles: '31,400', congestion: 0.61, avgSpeed: 26.3, flow: '76%', incidents: 5 }
];

const LIVE_TRAFFIC_FLOW_DATA = [
  { time: '00:00', density: 45, speed: 48, congestion: 0.22 },
  { time: '04:00', density: 30, speed: 52, congestion: 0.15 },
  { time: '08:00', density: 165, speed: 21, congestion: 0.78 },
  { time: '12:00', density: 95, speed: 36, congestion: 0.44 },
  { time: '16:00', density: 175, speed: 19, congestion: 0.82 },
  { time: '20:00', density: 110, speed: 31, congestion: 0.51 },
  { time: '24:00', density: 55, speed: 45, congestion: 0.28 }
];

const WEEKDAY_WEEKEND_DATA = [
  { metric: 'Traffic Density (veh/min)', Weekday: 132, Weekend: 98 },
  { metric: 'Average Speed (km/h)', Weekday: 24.1, Weekend: 32.7 },
  { metric: 'Congestion Index', Weekday: 0.71, Weekend: 0.48 }
];

const FORECAST_DATA = [
  { time: 'Now', actual: 0.68, predicted: 0.68, confidenceUpper: 0.72, confidenceLower: 0.64 },
  { time: '+2h', actual: null, predicted: 0.58, confidenceUpper: 0.64, confidenceLower: 0.52 },
  { time: '+4h', actual: null, predicted: 0.76, confidenceUpper: 0.82, confidenceLower: 0.70 },
  { time: '+6h', actual: null, predicted: 0.85, confidenceUpper: 0.91, confidenceLower: 0.79 },
  { time: '+8h', actual: null, predicted: 0.72, confidenceUpper: 0.78, confidenceLower: 0.66 },
  { time: '+10h', actual: null, predicted: 0.54, confidenceUpper: 0.60, confidenceLower: 0.48 },
  { time: '+12h', actual: null, predicted: 0.38, confidenceUpper: 0.44, confidenceLower: 0.32 }
];

const TOP_CORRIDORS = [
  { id: 1, name: 'Jayadev Vihar', avgSpeed: '19.7 km/h', congestion: 69, status: 'severe' },
  { id: 2, name: 'Bhubaneswar Railway Station', avgSpeed: '20.4 km/h', congestion: 65, status: 'heavy' },
  { id: 3, name: 'Patia Main Road', avgSpeed: '20.1 km/h', congestion: 64, status: 'heavy' },
  { id: 4, name: 'Nandankanan Road', avgSpeed: '24.9 km/h', congestion: 58, status: 'heavy' },
  { id: 5, name: 'KIIT Road', avgSpeed: '28.2 km/h', congestion: 53, status: 'moderate' }
];

const INCIDENTS_DATA = [
  { type: 'Accident', location: 'Jayadev Vihar', impact: 'High', time: '10:38 PM', severityColor: '#FF5A67' },
  { type: 'Road Construction', location: 'Nandankanan Road', impact: 'Moderate', time: '10:19 PM', severityColor: '#FFB020' },
  { type: 'Signal Failure', location: 'Patia Main Road', impact: 'Moderate', time: '10:12 PM', severityColor: '#FFB020' },
  { type: 'Road Closure', location: 'KIIT Square', impact: 'High', time: '09:58 PM', severityColor: '#FF5A67' },
  { type: 'Vehicle Breakdown', location: 'Cuttack Road', impact: 'Low', time: '09:41 PM', severityColor: '#27D17F' }
];

export default function TrafficIntelligenceView() {
  const [userLocation, setUserLocation] = useState(CITY_PRESETS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('10:42:22 PM');
  const [layersOpen, setLayersOpen] = useState(false);

  const [mapStyle, setMapStyle] = useState('Vibrant Street'); // 'Vibrant Street' | 'Satellite' | 'Dark GIS'
  const mapTileLayerRef = useRef(null);
  const mapLabelsLayerRef = useRef(null);

  const trafficMapContainerRef = useRef(null);
  const trafficMapInstanceRef = useRef(null);
  const trafficLayerGroupRef = useRef(null);

  // Dynamic GPS Geolocation
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({
            city: 'Detected Location',
            region: 'GPS Telemetry',
            country: 'Live Coordinates',
            lat: latitude,
            lng: longitude,
            vehicles: '22,480',
            congestion: 0.65,
            avgSpeed: 23.8,
            flow: '70%',
            incidents: 6
          });
          setIsLocating(false);
          setIsLocationModalOpen(false);
        },
        () => setIsLocating(false),
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSelectCity = (preset) => {
    setUserLocation(preset);
    setIsLocationModalOpen(false);
    setLastUpdated(new Date().toLocaleTimeString('en-US'));
  };

  const [gisLayers, setGisLayers] = useState({
    trafficFlow: true,
    incidents: true,
    roadClosures: true,
    construction: true,
    cameras: true
  });

  const handleToggleLayer = (layerKey) => {
    setGisLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Helper to update map tile layers
  const updateMapTiles = (map, style) => {
    if (mapTileLayerRef.current) map.removeLayer(mapTileLayerRef.current);
    if (mapLabelsLayerRef.current) map.removeLayer(mapLabelsLayerRef.current);

    if (style === 'Vibrant Street') {
      // High-contrast, clear OpenStreetMap tile layer
      mapTileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      mapLabelsLayerRef.current = null;
    } else if (style === 'Satellite') {
      // Esri World Imagery Satellite + Place Labels
      mapTileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);
      mapLabelsLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);
    } else {
      // Dark GIS Command Center Basemap
      mapTileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);
      mapLabelsLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      }).addTo(map);
    }
  };

  // Switch map style effect
  useEffect(() => {
    if (trafficMapInstanceRef.current) {
      updateMapTiles(trafficMapInstanceRef.current, mapStyle);
    }
  }, [mapStyle]);

  // Initialize & Update Traffic GIS Map
  useEffect(() => {
    if (!trafficMapContainerRef.current) return;

    if (!trafficMapInstanceRef.current) {
      const map = L.map(trafficMapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      updateMapTiles(map, mapStyle);

      const layerGroup = L.layerGroup().addTo(map);
      trafficLayerGroupRef.current = layerGroup;
      trafficMapInstanceRef.current = map;

      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);
    } else {
      trafficMapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14);
      setTimeout(() => {
        if (trafficMapInstanceRef.current) trafficMapInstanceRef.current.invalidateSize();
      }, 200);
    }

    // Render Real GIS Road Geometry Polylines with Popups & Markers
    if (trafficLayerGroupRef.current) {
      trafficLayerGroupRef.current.clearLayers();

      const bLat = userLocation.lat;
      const bLng = userLocation.lng;

      // 1. TRAFFIC FLOW POLYLINES
      if (gisLayers.trafficFlow) {
        // Smooth Flow Corridor (Green)
        const p1 = L.polyline([
          [bLat + 0.05, bLng - 0.04],
          [bLat + 0.02, bLng - 0.02],
          [bLat, bLng],
          [bLat - 0.03, bLng + 0.02]
        ], { color: '#10b981', weight: 6, opacity: 0.95 }).addTo(trafficLayerGroupRef.current);
        p1.bindTooltip('<b>Patia Main Road</b><br/>Status: Smooth Flow (28 km/h)', { permanent: false });

        // Moderate Flow Corridor (Amber)
        const p2 = L.polyline([
          [bLat - 0.04, bLng - 0.05],
          [bLat - 0.01, bLng - 0.02],
          [bLat, bLng],
          [bLat + 0.02, bLng + 0.03]
        ], { color: '#f59e0b', weight: 6, opacity: 0.95 }).addTo(trafficLayerGroupRef.current);
        p2.bindTooltip('<b>Nandankanan Road</b><br/>Status: Moderate (24 km/h)', { permanent: false });

        // Severe Congestion Corridor (Red)
        const p3 = L.polyline([
          [bLat - 0.01, bLng - 0.04],
          [bLat + 0.01, bLng - 0.01],
          [bLat + 0.02, bLng + 0.02],
          [bLat + 0.04, bLng + 0.04]
        ], { color: '#ef4444', weight: 7, opacity: 0.95 }).addTo(trafficLayerGroupRef.current);
        p3.bindTooltip('<b>Jayadev Vihar Junction</b><br/>Status: Severe Congestion (19 km/h)', { permanent: false });

        // Heavy Congestion Corridor (Orange)
        const p4 = L.polyline([
          [bLat + 0.04, bLng - 0.06],
          [bLat + 0.02, bLng - 0.03],
          [bLat - 0.01, bLng + 0.01]
        ], { color: '#f97316', weight: 6, opacity: 0.95 }).addTo(trafficLayerGroupRef.current);
        p4.bindTooltip('<b>Railway Station Corridor</b><br/>Status: Heavy Congestion (20 km/h)', { permanent: false });
      }

      // 2. INCIDENTS MARKERS
      if (gisLayers.incidents) {
        const accidentHtml = `<div style="background:#ef4444; color:#fff; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 0 10px #ef4444; border:2px solid #fff;">🚨</div>`;
        L.marker([bLat + 0.01, bLng - 0.01], {
          icon: L.divIcon({ html: accidentHtml, className: 'incident-icon', iconSize: [28, 28], iconAnchor: [14, 14] })
        }).bindPopup('<b>Accident Detected</b><br/>Jayadev Vihar • High Impact').addTo(trafficLayerGroupRef.current);

        const signalHtml = `<div style="background:#f59e0b; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:13px; box-shadow:0 0 8px #f59e0b; border:2px solid #fff;">🚦</div>`;
        L.marker([bLat - 0.015, bLng + 0.015], {
          icon: L.divIcon({ html: signalHtml, className: 'incident-icon', iconSize: [26, 26], iconAnchor: [13, 13] })
        }).bindPopup('<b>Signal Failure</b><br/>Patia Square • Manual Dispatch').addTo(trafficLayerGroupRef.current);
      }

      // 3. ROAD CLOSURES MARKERS
      if (gisLayers.roadClosures) {
        const closureHtml = `<div style="background:#dc2626; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:12px; box-shadow:0 0 8px #dc2626; border:2px solid #fff;">⛔</div>`;
        L.marker([bLat + 0.025, bLng - 0.02], {
          icon: L.divIcon({ html: closureHtml, className: 'closure-icon', iconSize: [26, 26], iconAnchor: [13, 13] })
        }).bindPopup('<b>Road Closure</b><br/>KIIT Square • Utility Maintenance Work').addTo(trafficLayerGroupRef.current);
      }

      // 4. CONSTRUCTION MARKERS
      if (gisLayers.construction) {
        const constrHtml = `<div style="background:#f59e0b; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:12px; box-shadow:0 0 8px #f59e0b; border:2px solid #fff;">🚧</div>`;
        L.marker([bLat - 0.02, bLng - 0.03], {
          icon: L.divIcon({ html: constrHtml, className: 'incident-icon', iconSize: [26, 26], iconAnchor: [13, 13] })
        }).bindPopup('<b>Road Construction</b><br/>Nandankanan Road • Lane Restricted').addTo(trafficLayerGroupRef.current);
      }

      // 5. CAMERAS MARKERS
      if (gisLayers.cameras) {
        const camHtml = `<div style="background:#0284c7; color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-size:11px; box-shadow:0 0 8px #0284c7; border:2px solid #fff;">📷</div>`;
        L.marker([bLat + 0.03, bLng + 0.02], {
          icon: L.divIcon({ html: camHtml, className: 'cam-icon', iconSize: [24, 24], iconAnchor: [12, 12] })
        }).bindPopup('<b>AI Traffic Camera #104</b><br/>Live 4K Stream • 98% Accuracy').addTo(trafficLayerGroupRef.current);

        L.marker([bLat - 0.03, bLng - 0.01], {
          icon: L.divIcon({ html: camHtml, className: 'cam-icon', iconSize: [24, 24], iconAnchor: [12, 12] })
        }).bindPopup('<b>AI Traffic Camera #108</b><br/>Vani Vihar Junction • Operational').addTo(trafficLayerGroupRef.current);
      }

      // Central Location Marker Node (Always Visible)
      const userMarkerHtml = `
        <div style="position: relative; width: 28px; height: 28px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(30, 167, 255, 0.5); animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position: absolute; inset: 4px; border-radius: 50%; background: #1EA7FF; border: 2px solid #ffffff; box-shadow: 0 0 12px rgba(30, 167, 255, 0.9);"></div>
        </div>
      `;
      const userIcon = L.divIcon({ html: userMarkerHtml, className: 'custom-traffic-user-icon', iconSize: [28, 28], iconAnchor: [14, 14] });
      L.marker([bLat, bLng], { icon: userIcon }).bindPopup(`<b>${userLocation.city} Control Center Node</b><br/>Congestion: ${Math.round(userLocation.congestion * 100)}%`).addTo(trafficLayerGroupRef.current);
    }
  }, [userLocation, gisLayers]);

  const handleZoomIn = () => { if (trafficMapInstanceRef.current) trafficMapInstanceRef.current.zoomIn(); };
  const handleZoomOut = () => { if (trafficMapInstanceRef.current) trafficMapInstanceRef.current.zoomOut(); };
  const handleRecenter = () => { if (trafficMapInstanceRef.current) trafficMapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14); };

  const filteredPresets = CITY_PRESETS.filter(p => 
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#050B18', minHeight: '100vh', paddingBottom: '30px' }}>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .enterprise-traffic-card {
          background: #0B1730;
          border: 1px solid rgba(120, 170, 255, 0.18);
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .enterprise-traffic-card:hover {
          border-color: rgba(32, 217, 255, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.45);
        }
      `}</style>

      {/* 1. OPERATIONAL PAGE HEADER & LOCATION BAR */}
      <div style={{
        background: '#0B1730',
        border: '1px solid rgba(120, 170, 255, 0.18)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'rgba(32, 217, 255, 0.12)', 
            border: '1px solid rgba(32, 217, 255, 0.35)', 
            display: 'flex', 
            alignItems: 'center', 
            justify: 'center',
            boxShadow: '0 0 16px rgba(32, 217, 255, 0.2)'
          }}>
            <Car size={24} color="#20D9FF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F5F8FF', margin: 0, letterSpacing: '-0.02em' }}>
                Traffic Intelligence & Mobility Operations
              </h1>
              <span style={{
                background: 'rgba(32, 217, 255, 0.12)',
                border: '1px solid rgba(32, 217, 255, 0.3)',
                color: '#20D9FF',
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                GIS COMMAND CENTER
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#91A4C5', margin: '4px 0 0 0' }}>
              Real-time traffic telemetry, GIS corridor monitoring, and urban congestion analytics.
            </p>
          </div>
        </div>

        {/* Location Region Selector Badge */}
        <div style={{ 
          background: '#101E3A', 
          border: '1px solid rgba(120, 170, 255, 0.18)', 
          borderRadius: '12px', 
          padding: '10px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.66rem', color: '#91A4C5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              MONITORED REGION
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#F5F8FF', marginTop: '2px' }}>
              {userLocation.city}, {userLocation.country}
            </div>
            <div style={{ fontSize: '0.64rem', color: '#27D17F', marginTop: '2px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#27D17F' }} />
              Live Telemetry • Last Updated: {lastUpdated}
            </div>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            style={{
              background: 'rgba(30, 167, 255, 0.15)',
              border: '1px solid rgba(30, 167, 255, 0.4)',
              borderRadius: '8px',
              color: '#20D9FF',
              padding: '8px 14px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPin size={14} />
            <span>Change Location</span>
          </button>
        </div>
      </div>

      {/* 2. TOP KPI STRIP (6 COMPACT ENTERPRISE CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
        
        {/* LIVE VEHICLES */}
        <div className="enterprise-traffic-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.05em' }}>LIVE VEHICLES</span>
            <Car size={16} color="#20D9FF" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F5F8FF', marginTop: '6px', lineHeight: 1 }}>{userLocation.vehicles}</div>
          <div style={{ fontSize: '0.66rem', color: '#27D17F', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ArrowUpRight size={12} /> ▲ 8.6% vs 10m ago
          </div>
        </div>

        {/* CONGESTION INDEX */}
        <div className="enterprise-traffic-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.05em' }}>CONGESTION INDEX</span>
            <Gauge size={16} color="#FFB020" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFB020', marginTop: '6px', lineHeight: 1 }}>{userLocation.congestion}</div>
          <div style={{ fontSize: '0.66rem', color: '#FFB020', marginTop: '6px', fontWeight: 700 }}>
            Moderate • <span style={{ color: '#27D17F' }}>▲ 5.3%</span>
          </div>
        </div>

        {/* AVERAGE SPEED */}
        <div className="enterprise-traffic-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.05em' }}>AVERAGE SPEED</span>
            <Activity size={16} color="#27D17F" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F5F8FF', marginTop: '6px', lineHeight: 1 }}>{userLocation.avgSpeed} <span style={{ fontSize: '0.78rem', color: '#91A4C5' }}>km/h</span></div>
          <div style={{ fontSize: '0.66rem', color: '#FF5A67', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ArrowDownRight size={12} /> ▼ -8.4%
          </div>
        </div>

        {/* NETWORK FLOW */}
        <div className="enterprise-traffic-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.05em' }}>NETWORK FLOW</span>
            <Radio size={16} color="#27D17F" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#27D17F', marginTop: '6px', lineHeight: 1 }}>{userLocation.flow}</div>
          <div style={{ fontSize: '0.66rem', color: '#27D17F', marginTop: '6px', fontWeight: 700 }}>
            Optimal • ▲ 6.2%
          </div>
        </div>

        {/* ACTIVE INCIDENTS */}
        <div className="enterprise-traffic-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.05em' }}>ACTIVE INCIDENTS</span>
            <AlertTriangle size={16} color="#FF5A67" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FF5A67', marginTop: '6px', lineHeight: 1 }}>{userLocation.incidents}</div>
          <div style={{ fontSize: '0.66rem', color: '#FF5A67', marginTop: '6px', fontWeight: 700 }}>▲ 2 vs 10m ago</div>
        </div>

        {/* ROAD CAPACITY */}
        <div className="enterprise-traffic-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.05em' }}>ROAD CAPACITY</span>
            <Clock size={16} color="#7C5CFF" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F5F8FF', marginTop: '6px', lineHeight: 1 }}>68%</div>
          <div style={{ fontSize: '0.66rem', color: '#FFB020', marginTop: '6px', fontWeight: 700 }}>Moderate Load</div>
        </div>

      </div>

      {/* 3. MAIN MIDDLE SECTION (REAL GIS TRAFFIC MAP + RIGHT TELEMETRY PANELS) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '20px' }}>
        
        {/* CENTERPIECE: REAL-WORLD GIS TRAFFIC MAP */}
        <div 
          className="enterprise-traffic-card"
          style={{ 
            position: 'relative', 
            padding: 0,
            overflow: 'hidden', 
            background: '#070b12', 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '460px'
          }}
        >
          {/* Header Overlay with Map Style Switcher */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 10, 
            padding: '12px 18px', 
            background: 'linear-gradient(180deg, rgba(7,11,18,0.95) 0%, rgba(7,11,18,0) 100%)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.04em' }}>
                LIVE GIS TRAFFIC MAP
              </span>
              <span style={{ 
                background: 'rgba(39, 209, 127, 0.15)', 
                border: '1px solid #27D17F', 
                color: '#27D17F', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.64rem', 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#27D17F' }} />
                LIVE STREAM
              </span>
            </div>

            {/* Map Style Selector Pills */}
            <div style={{ 
              display: 'flex', 
              background: '#0B1730', 
              border: '1px solid rgba(120, 170, 255, 0.25)', 
              borderRadius: '8px', 
              padding: '2px' 
            }}>
              {['Vibrant Street', 'Satellite', 'Dark GIS'].map((style) => {
                const isActive = mapStyle === style;
                return (
                  <button
                    key={style}
                    onClick={() => setMapStyle(style)}
                    style={{
                      background: isActive ? '#1EA7FF' : 'transparent',
                      color: isActive ? '#ffffff' : '#91A4C5',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {style === 'Vibrant Street' && '🗺️ '}
                    {style === 'Satellite' && '🛰️ '}
                    {style === 'Dark GIS' && '🌙 '}
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floating GIS Layers Card (Top Right) */}
          <div style={{ 
            position: 'absolute', 
            top: '52px', 
            right: '14px', 
            zIndex: 10, 
            background: '#0B1730', 
            border: '1px solid rgba(120, 170, 255, 0.25)', 
            borderRadius: '10px', 
            padding: '12px 14px',
            fontSize: '0.72rem',
            color: '#F5F8FF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '150px'
          }}>
            <div style={{ fontWeight: 800, color: '#91A4C5', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} color="#20D9FF" /> GIS Layers
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={gisLayers.trafficFlow} 
                onChange={() => handleToggleLayer('trafficFlow')}
                style={{ cursor: 'pointer', accentColor: '#1EA7FF' }} 
              /> Traffic Flow
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={gisLayers.incidents} 
                onChange={() => handleToggleLayer('incidents')}
                style={{ cursor: 'pointer', accentColor: '#1EA7FF' }} 
              /> Incidents
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={gisLayers.roadClosures} 
                onChange={() => handleToggleLayer('roadClosures')}
                style={{ cursor: 'pointer', accentColor: '#1EA7FF' }} 
              /> Road Closures
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={gisLayers.construction} 
                onChange={() => handleToggleLayer('construction')}
                style={{ cursor: 'pointer', accentColor: '#1EA7FF' }} 
              /> Construction
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={gisLayers.cameras} 
                onChange={() => handleToggleLayer('cameras')}
                style={{ cursor: 'pointer', accentColor: '#1EA7FF' }} 
              /> Cameras
            </label>
          </div>

          {/* Floating GIS Map Controls */}
          <div style={{ 
            position: 'absolute', 
            bottom: '50px', 
            right: '14px', 
            zIndex: 10, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            background: '#0B1730',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(120, 170, 255, 0.2)'
          }}>
            <button onClick={handleZoomIn} style={{ background: 'none', border: 'none', color: '#F5F8FF', padding: '6px', cursor: 'pointer' }}><Plus size={15} /></button>
            <button onClick={handleZoomOut} style={{ background: 'none', border: 'none', color: '#F5F8FF', padding: '6px', cursor: 'pointer' }}><Minus size={15} /></button>
            <button onClick={handleRecenter} style={{ background: 'none', border: 'none', color: '#20D9FF', padding: '6px', cursor: 'pointer' }}><Compass size={15} /></button>
          </div>

          {/* Floating Traffic Legend */}
          <div style={{ 
            position: 'absolute', 
            bottom: '14px', 
            left: '14px', 
            zIndex: 10, 
            background: '#0B1730', 
            border: '1px solid rgba(120, 170, 255, 0.2)', 
            borderRadius: '10px', 
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#91A4C5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Traffic Severity Legend</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
              <span style={{ color: '#27D17F', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '4px', background: '#27D17F', borderRadius: '2px' }} /> Smooth
              </span>
              <span style={{ color: '#FFB020', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '4px', background: '#FFB020', borderRadius: '2px' }} /> Moderate
              </span>
              <span style={{ color: '#FF7E20', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '4px', background: '#FF7E20', borderRadius: '2px' }} /> Heavy
              </span>
              <span style={{ color: '#FF5A67', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '4px', background: '#FF5A67', borderRadius: '2px' }} /> Severe
              </span>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div 
            ref={trafficMapContainerRef} 
            style={{ 
              width: '100%', 
              height: '100%', 
              minHeight: '460px', 
              flex: 1, 
              zIndex: 1 
            }} 
          />
        </div>

        {/* RIGHT COLUMN: LIVE FLOW, GAUGE & CORRIDOR RANKINGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. LIVE TRAFFIC FLOW TIME SERIES CHART */}
          <div className="enterprise-traffic-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.03em' }}>
                LIVE TRAFFIC FLOW TELEMETRY
              </span>
              <span style={{ fontSize: '0.66rem', color: '#27D17F', fontWeight: 700 }}>● Auto Sync</span>
            </div>

            <div style={{ height: '140px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LIVE_TRAFFIC_FLOW_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 170, 255, 0.1)" vertical={false} />
                  <XAxis dataKey="time" stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} domain={[0, 200]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} domain={[0, 1.0]} />
                  <Tooltip contentStyle={{ background: '#0B1730', border: '1px solid rgba(120, 170, 255, 0.2)', borderRadius: '8px', fontSize: '0.72rem', color: '#F5F8FF' }} />
                  <Line yAxisId="left" type="monotone" dataKey="density" stroke="#20D9FF" strokeWidth={2} name="Density (veh/min)" dot={{ r: 2 }} />
                  <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#27D17F" strokeWidth={2} name="Speed (km/h)" dot={{ r: 2 }} />
                  <Line yAxisId="right" type="monotone" dataKey="congestion" stroke="#FF5A67" strokeWidth={2} name="Congestion Index" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. NETWORK CONGESTION GAUGE CARD */}
          <div className="enterprise-traffic-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#91A4C5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                NETWORK CONGESTION
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFB020', marginTop: '2px', lineHeight: 1 }}>
                {userLocation.congestion}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#FFB020', fontWeight: 800, marginTop: '4px' }}>Moderate Risk</div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(120, 170, 255, 0.18)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Peak Congestion</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FF5A67' }}>0.82 Severe</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Avg Travel Speed</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F5F8FF' }}>24.7 km/h</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Delay Index</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F5F8FF' }}>1.42</div>
              </div>
            </div>
          </div>

          {/* 3. TOP CONGESTED CORRIDORS RANKINGS */}
          <div className="enterprise-traffic-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.03em' }}>
                TOP CONGESTED CORRIDORS
              </span>
              <span style={{ fontSize: '0.72rem', color: '#20D9FF', fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TOP_CORRIDORS.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#101E3A', borderRadius: '8px', fontSize: '0.76rem', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                  <div>
                    <span style={{ color: '#91A4C5', marginRight: '8px', fontWeight: 800 }}>#{item.id}</span>
                    <span style={{ color: '#F5F8FF', fontWeight: 800 }}>{item.name}</span>
                    <div style={{ fontSize: '0.66rem', color: '#91A4C5', marginTop: '1px' }}>Avg Speed: {item.avgSpeed}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 900, 
                      color: item.congestion > 65 ? '#FF5A67' : (item.congestion > 55 ? '#FF7E20' : '#FFB020') 
                    }}>
                      {item.congestion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. LOWER 3-COLUMN ANALYTICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* COLUMN 1: WEEKDAY VS WEEKEND & PEAK HOURS */}
        <div className="enterprise-traffic-card">
          <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.03em', marginBottom: '12px' }}>
            WEEKDAY VS WEEKEND TRAFFIC FLOW
          </div>

          <div style={{ height: '160px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKDAY_WEEKEND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 170, 255, 0.1)" vertical={false} />
                <XAxis dataKey="metric" stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0B1730', border: '1px solid rgba(120, 170, 255, 0.2)', borderRadius: '8px', fontSize: '0.72rem', color: '#F5F8FF' }} />
                <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '4px' }} />
                <Bar dataKey="Weekday" fill="#1EA7FF" radius={[4, 4, 0, 0]} barSize={22} />
                <Bar dataKey="Weekend" fill="#27D17F" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '14px', borderTop: '1px solid rgba(120, 170, 255, 0.12)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#F5F8FF', marginBottom: '6px' }}>CORRIDOR PEAK WINDOWS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#91A4C5' }}>
              <span>Morning Rush (07:30 - 10:30 AM)</span>
              <span style={{ color: '#FF5A67', fontWeight: 800 }}>High Congestion</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#91A4C5', marginTop: '4px' }}>
              <span>Evening Rush (05:00 - 08:00 PM)</span>
              <span style={{ color: '#FF5A67', fontWeight: 800 }}>High Congestion</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#91A4C5', marginTop: '4px' }}>
              <span>Off-Peak (11:00 PM - 04:00 AM)</span>
              <span style={{ color: '#27D17F', fontWeight: 800 }}>Low Congestion</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: SHORT-TERM CONGESTION FORECAST (NEXT 12 HOURS) */}
        <div className="enterprise-traffic-card">
          <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.03em', marginBottom: '2px' }}>
            SHORT-TERM CONGESTION FORECAST
          </div>
          <div style={{ fontSize: '0.7rem', color: '#91A4C5', marginBottom: '12px' }}>12-Hour AI Predictive Trajectory</div>

          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FORECAST_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20D9FF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#20D9FF" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120, 170, 255, 0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#91A4C5" tick={{ fontSize: 9, fill: '#91A4C5' }} axisLine={false} tickLine={false} domain={[0, 1.0]} />
                <Tooltip contentStyle={{ background: '#0B1730', border: '1px solid rgba(120, 170, 255, 0.2)', borderRadius: '8px', fontSize: '0.72rem', color: '#F5F8FF' }} />
                <Legend wrapperStyle={{ fontSize: '0.72rem' }} />
                <Area type="monotone" dataKey="confidenceUpper" stroke="none" fill="url(#colorConfidence)" name="Confidence Interval" />
                <Line type="monotone" dataKey="actual" stroke="#1EA7FF" strokeWidth={3} name="Actual" dot={{ r: 4, fill: '#1EA7FF' }} />
                <Line type="monotone" dataKey="predicted" stroke="#FF5A67" strokeWidth={2} strokeDasharray="4 4" name="Predicted" dot={{ r: 3, fill: '#FF5A67' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COLUMN 3: LIVE TRAFFIC INCIDENTS & CAMERA NETWORK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* LIVE TRAFFIC INCIDENTS */}
          <div className="enterprise-traffic-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.03em' }}>
                LIVE TRAFFIC INCIDENTS
              </span>
              <span style={{ fontSize: '0.72rem', color: '#20D9FF', fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {INCIDENTS_DATA.slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#101E3A', borderRadius: '8px', fontSize: '0.74rem', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <AlertTriangle size={15} color={item.severityColor} />
                    <div>
                      <div style={{ fontWeight: 800, color: '#F5F8FF' }}>{item.type}</div>
                      <div style={{ fontSize: '0.66rem', color: '#91A4C5' }}>{item.location}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: item.severityColor, fontWeight: 800 }}>{item.impact}</span>
                    <div style={{ fontSize: '0.62rem', color: '#91A4C5' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRAFFIC CAMERA NETWORK */}
          <div className="enterprise-traffic-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#F5F8FF', letterSpacing: '0.03em' }}>
                TRAFFIC CAMERA NETWORK
              </span>
              <span style={{ fontSize: '0.72rem', color: '#20D9FF', fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', marginTop: '8px' }}>
              <div style={{ background: '#101E3A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Total</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#F5F8FF' }}>128</div>
              </div>
              <div style={{ background: '#101E3A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Online</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#27D17F' }}>112</div>
              </div>
              <div style={{ background: '#101E3A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Offline</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FF5A67' }}>16</div>
              </div>
              <div style={{ background: '#101E3A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Junctions</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#20D9FF' }}>67</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. BOTTOM DETAILED STATUS FOOTER BAR */}
      <div style={{ 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        padding: '10px 18px', 
        background: '#0B1730', 
        border: '1px solid rgba(120, 170, 255, 0.18)', 
        borderRadius: '12px',
        fontSize: '0.74rem',
        color: '#91A4C5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={14} color="#20D9FF" />
          <span>Data Source: <strong style={{ color: '#F5F8FF' }}>Urban Sensors Telemetry Network</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#27D17F' }} />
            Auto Refresh: <strong style={{ color: '#F5F8FF' }}>ON (30s)</strong>
          </span>
          <span style={{ color: 'rgba(120, 170, 255, 0.3)' }}>|</span>
          <span>Data Quality: <strong style={{ color: '#27D17F' }}>98.6%</strong></span>
          <span style={{ color: 'rgba(120, 170, 255, 0.3)' }}>|</span>
          <span>Model Accuracy: <strong style={{ color: '#20D9FF' }}>±5%</strong></span>
          <span style={{ color: 'rgba(120, 170, 255, 0.3)' }}>|</span>
          <span>Last Updated: <strong style={{ color: '#F5F8FF' }}>{lastUpdated}</strong></span>
        </div>
      </div>

      {/* LOCATION SELECTION MODAL */}
      {isLocationModalOpen && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 9999, 
          background: 'rgba(5, 11, 24, 0.85)', 
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            background: '#0B1730', 
            border: '1px solid rgba(32, 217, 255, 0.35)', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '520px', 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F5F8FF', margin: 0 }}>
                  Select Traffic Monitoring Region
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#91A4C5', margin: '4px 0 0 0' }}>
                  Center traffic GIS telemetry and corridor analytics
                </p>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} style={{ background: 'none', border: 'none', color: '#91A4C5', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              style={{
                background: 'rgba(30, 167, 255, 0.15)',
                border: '1px dashed rgba(32, 217, 255, 0.4)',
                borderRadius: '10px',
                padding: '12px',
                color: '#20D9FF',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px'
              }}
            >
              <MapPin size={16} />
              <span>{isLocating ? 'Detecting Coordinates...' : 'Use My Live GPS Geolocation'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#101E3A', border: '1px solid rgba(120, 170, 255, 0.18)', borderRadius: '8px', padding: '8px 12px' }}>
              <Search size={16} color="#91A4C5" />
              <input 
                type="text" 
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#F5F8FF', outline: 'none', fontSize: '0.84rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {filteredPresets.map((preset, idx) => {
                const isSelected = userLocation.city === preset.city;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectCity(preset)}
                    style={{
                      background: isSelected ? 'rgba(30, 167, 255, 0.18)' : '#101E3A',
                      border: isSelected ? '1px solid rgba(32, 217, 255, 0.4)' : '1px solid rgba(120, 170, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#F5F8FF' }}>
                        {preset.city}, {preset.country}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#91A4C5', marginTop: '2px' }}>
                        {preset.region} &nbsp;•&nbsp; Vehicles: {preset.vehicles}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#20D9FF' }}>
                        {Math.round(preset.congestion * 100)}% Congestion
                      </span>
                      {isSelected && <CheckCircle2 size={16} color="#27D17F" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
