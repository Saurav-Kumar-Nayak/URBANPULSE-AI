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

// EXISTING BHUBANESWAR ROAD GEOMETRY CORRIDORS (FOR DYNAMIC VEHICLE NAVIGATION)
// REAL ROAD NETWORK GRAPH STRUCTURE (NODES & EDGES)
const ROAD_GRAPH_NODES = {
  N_NK:      { id: 'N_NK',      name: 'Nandankanan North', x: 62.0, y: 12.0, lat: 20.3700, lng: 85.8300 },
  N_PATIA:   { id: 'N_PATIA',   name: 'Patia Square',      x: 48.0, y: 38.0, lat: 20.3588, lng: 85.8184 },
  N_JAYADEV: { id: 'N_JAYADEV', name: 'Jayadev Vihar',    x: 16.0, y: 27.0, lat: 20.2980, lng: 85.8245 },
  N_SAHEED:  { id: 'N_SAHEED',  name: 'Saheed Nagar',     x: 26.0, y: 12.0, lat: 20.2885, lng: 85.8420 },
  N_VANI:    { id: 'N_VANI',    name: 'Vani Vihar',        x: 84.0, y: 28.0, lat: 20.2910, lng: 85.8580 },
  N_KIIT:    { id: 'N_KIIT',    name: 'KIIT Square',       x: 74.0, y: 53.0, lat: 20.3530, lng: 85.8150 },
  N_STATION: { id: 'N_STATION', name: 'Railway Station',   x: 38.0, y: 28.0, lat: 20.2650, lng: 85.8400 },
  N_KHAN:    { id: 'N_KHAN',    name: 'Khandagiri Square', x: 18.0, y: 68.0, lat: 20.2600, lng: 85.7850 }
};

const ROAD_GRAPH_EDGES = [
  // 1. Nandankanan North <-> Patia Square
  {
    id: 'E_NK_PATIA',
    from: 'N_NK',
    to: 'N_PATIA',
    points: [
      { x: 62.0, y: 12.0, lat: 20.3700, lng: 85.8300 },
      { x: 55.0, y: 25.0, lat: 20.3644, lng: 85.8242 },
      { x: 48.0, y: 38.0, lat: 20.3588, lng: 85.8184 }
    ]
  },
  // 2. Patia Square <-> Jayadev Vihar
  {
    id: 'E_PATIA_JAYADEV',
    from: 'N_PATIA',
    to: 'N_JAYADEV',
    points: [
      { x: 48.0, y: 38.0, lat: 20.3588, lng: 85.8184 },
      { x: 40.0, y: 35.0, lat: 20.3436, lng: 85.8199 },
      { x: 32.0, y: 32.5, lat: 20.3284, lng: 85.8214 },
      { x: 24.0, y: 30.0, lat: 20.3132, lng: 85.8229 },
      { x: 16.0, y: 27.0, lat: 20.2980, lng: 85.8245 }
    ]
  },
  // 3. Jayadev Vihar <-> Saheed Nagar (Janpath W)
  {
    id: 'E_JAYADEV_SAHEED',
    from: 'N_JAYADEV',
    to: 'N_SAHEED',
    points: [
      { x: 16.0, y: 27.0, lat: 20.2980, lng: 85.8245 },
      { x: 21.0, y: 19.5, lat: 20.2932, lng: 85.8332 },
      { x: 26.0, y: 12.0, lat: 20.2885, lng: 85.8420 }
    ]
  },
  // 4. Saheed Nagar <-> Vani Vihar (Janpath E)
  {
    id: 'E_SAHEED_VANI',
    from: 'N_SAHEED',
    to: 'N_VANI',
    points: [
      { x: 26.0, y: 12.0, lat: 20.2885, lng: 85.8420 },
      { x: 40.0, y: 16.0, lat: 20.2891, lng: 85.8460 },
      { x: 55.0, y: 20.0, lat: 20.2897, lng: 85.8500 },
      { x: 70.0, y: 24.0, lat: 20.2903, lng: 85.8540 },
      { x: 84.0, y: 28.0, lat: 20.2910, lng: 85.8580 }
    ]
  },
  // 5. Patia Square <-> KIIT Square
  {
    id: 'E_PATIA_KIIT',
    from: 'N_PATIA',
    to: 'N_KIIT',
    points: [
      { x: 48.0, y: 38.0, lat: 20.3588, lng: 85.8184 },
      { x: 61.0, y: 45.5, lat: 20.3559, lng: 85.8167 },
      { x: 74.0, y: 53.0, lat: 20.3530, lng: 85.8150 }
    ]
  },
  // 6. KIIT Square <-> Vani Vihar Outer Bypass
  {
    id: 'E_KIIT_VANI',
    from: 'N_KIIT',
    to: 'N_VANI',
    points: [
      { x: 74.0, y: 53.0, lat: 20.3530, lng: 85.8150 },
      { x: 79.0, y: 40.5, lat: 20.3220, lng: 85.8365 },
      { x: 84.0, y: 28.0, lat: 20.2910, lng: 85.8580 }
    ]
  },
  // 7. Jayadev Vihar <-> Railway Station Link
  {
    id: 'E_JAYADEV_STATION',
    from: 'N_JAYADEV',
    to: 'N_STATION',
    points: [
      { x: 16.0, y: 27.0, lat: 20.2980, lng: 85.8245 },
      { x: 27.0, y: 27.5, lat: 20.2815, lng: 85.8322 },
      { x: 38.0, y: 28.0, lat: 20.2650, lng: 85.8400 }
    ]
  },
  // 8. Railway Station <-> Khandagiri South Ring
  {
    id: 'E_STATION_KHAN',
    from: 'N_STATION',
    to: 'N_KHAN',
    points: [
      { x: 38.0, y: 28.0, lat: 20.2650, lng: 85.8400 },
      { x: 28.0, y: 48.0, lat: 20.2625, lng: 85.8125 },
      { x: 18.0, y: 68.0, lat: 20.2600, lng: 85.7850 }
    ]
  },
  // 9. Khandagiri <-> Jayadev Vihar West Highway
  {
    id: 'E_KHAN_JAYADEV',
    from: 'N_KHAN',
    to: 'N_JAYADEV',
    points: [
      { x: 18.0, y: 68.0, lat: 20.2600, lng: 85.7850 },
      { x: 17.0, y: 47.5, lat: 20.2790, lng: 85.8047 },
      { x: 16.0, y: 27.0, lat: 20.2980, lng: 85.8245 }
    ]
  },
  // 10. Nandankanan North <-> KIIT Expressway
  {
    id: 'E_NK_KIIT',
    from: 'N_NK',
    to: 'N_KIIT',
    points: [
      { x: 62.0, y: 12.0, lat: 20.3700, lng: 85.8300 },
      { x: 68.0, y: 32.5, lat: 20.3615, lng: 85.8225 },
      { x: 74.0, y: 53.0, lat: 20.3530, lng: 85.8150 }
    ]
  },
  // 11. KIIT Square <-> Railway Station Direct Link
  {
    id: 'E_KIIT_STATION',
    from: 'N_KIIT',
    to: 'N_STATION',
    points: [
      { x: 74.0, y: 53.0, lat: 20.3530, lng: 85.8150 },
      { x: 56.0, y: 40.5, lat: 20.3090, lng: 85.8275 },
      { x: 38.0, y: 28.0, lat: 20.2650, lng: 85.8400 }
    ]
  }
];

// Helper to precalculate lengths and segment vectors for each edge
const PROCESSED_EDGES = ROAD_GRAPH_EDGES.map((edge) => {
  const segments = [];
  let totalLength = 0;

  for (let i = 0; i < edge.points.length - 1; i++) {
    const p1 = edge.points[i];
    const p2 = edge.points[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segments.push({ p1, p2, len, startDist: totalLength, endDist: totalLength + len });
    totalLength += len;
  }

  return { ...edge, segments, totalLength };
});

const EDGES_MAP = {};
PROCESSED_EDGES.forEach((e) => { EDGES_MAP[e.id] = e; });

// POLYLINE INTERPOLATION WITH TANGENT HEADING AND LANE SEPARATION
const getPolylineSample = (edgeId, progressRatio, direction, lane = 1) => {
  const edge = EDGES_MAP[edgeId];
  if (!edge || edge.segments.length === 0) {
    return { x: 50, y: 50, lat: 20.3, lng: 85.8, heading: 0 };
  }

  const clampedRatio = Math.max(0, Math.min(1, progressRatio));
  const targetDist = direction === 1 
    ? clampedRatio * edge.totalLength 
    : (1 - clampedRatio) * edge.totalLength;

  let seg = edge.segments[0];
  for (let i = 0; i < edge.segments.length; i++) {
    if (targetDist >= edge.segments[i].startDist && targetDist <= edge.segments[i].endDist) {
      seg = edge.segments[i];
      break;
    }
  }

  const segDist = targetDist - seg.startDist;
  const t = seg.len > 0 ? segDist / seg.len : 0;

  const baseX = seg.p1.x + (seg.p2.x - seg.p1.x) * t;
  const baseY = seg.p1.y + (seg.p2.y - seg.p1.y) * t;
  const baseLat = seg.p1.lat + (seg.p2.lat - seg.p1.lat) * t;
  const baseLng = seg.p1.lng + (seg.p2.lng - seg.p1.lng) * t;

  const dx = seg.p2.x - seg.p1.x;
  const dy = seg.p2.y - seg.p1.y;
  const angleRad = Math.atan2(dy, dx);
  
  const headingDeg = direction === 1 
    ? Math.round(angleRad * (180 / Math.PI)) 
    : Math.round((angleRad + Math.PI) * (180 / Math.PI));

  const laneOffset3d = 0.45;
  const laneOffsetGis = 0.00015;

  const perpX = -Math.sin(angleRad) * laneOffset3d * lane * direction;
  const perpY = Math.cos(angleRad) * laneOffset3d * lane * direction;
  const perpLat = -Math.sin(angleRad) * laneOffsetGis * lane * direction;
  const perpLng = Math.cos(angleRad) * laneOffsetGis * lane * direction;

  return {
    x: baseX + perpX,
    y: baseY + perpY,
    lat: baseLat + perpLat,
    lng: baseLng + perpLng,
    heading: headingDeg
  };
};

// JUNCTION ROUTING: PICK NEXT CONNECTED ROAD AT INTERSECTION NODE
const getConnectedNextEdge = (currentNodeId, prevEdgeId) => {
  const candidates = PROCESSED_EDGES.filter(
    (e) => e.from === currentNodeId || e.to === currentNodeId
  );
  if (candidates.length === 0) return { edgeId: prevEdgeId, direction: 1 };

  const nonPrev = candidates.filter((e) => e.id !== prevEdgeId);
  const chosen = nonPrev.length > 0 
    ? nonPrev[Math.floor(Math.random() * nonPrev.length)] 
    : candidates[0];

  const direction = chosen.from === currentNodeId ? 1 : -1;
  return { edgeId: chosen.id, direction };
};

// INITIAL VEHICLE FLEET SIMULATION DATA (GRAPH BOUND)
const INITIAL_VEHICLES = [
  { id: 'v1',  type: 'car',       color: '#38bdf8', edgeId: 'E_NK_PATIA',        progressRatio: 0.15, direction: 1,  lane: 1,  baseSpeed: 0.0018 },
  { id: 'v2',  type: 'car',       color: '#34d399', edgeId: 'E_NK_PATIA',        progressRatio: 0.65, direction: 1,  lane: 1,  baseSpeed: 0.0022 },
  { id: 'v3',  type: 'bus',       color: '#f59e0b', edgeId: 'E_NK_PATIA',        progressRatio: 0.40, direction: -1, lane: -1, baseSpeed: 0.0014 },
  { id: 'v4',  type: 'car',       color: '#ffffff', edgeId: 'E_PATIA_JAYADEV',   progressRatio: 0.20, direction: 1,  lane: 1,  baseSpeed: 0.0020 },
  { id: 'v5',  type: 'car',       color: '#f87171', edgeId: 'E_PATIA_JAYADEV',   progressRatio: 0.70, direction: 1,  lane: 1,  baseSpeed: 0.0023 },
  { id: 'v6',  type: 'ev',        color: '#06b6d4', edgeId: 'E_PATIA_JAYADEV',   progressRatio: 0.50, direction: -1, lane: -1, baseSpeed: 0.0021 },
  { id: 'v7',  type: 'car',       color: '#a855f7', edgeId: 'E_JAYADEV_SAHEED',  progressRatio: 0.35, direction: 1,  lane: 1,  baseSpeed: 0.0019 },
  { id: 'v8',  type: 'bus',       color: '#f59e0b', edgeId: 'E_SAHEED_VANI',     progressRatio: 0.60, direction: 1,  lane: 1,  baseSpeed: 0.0015 },
  { id: 'v9',  type: 'car',       color: '#38bdf8', edgeId: 'E_SAHEED_VANI',     progressRatio: 0.25, direction: -1, lane: -1, baseSpeed: 0.0022 },
  { id: 'v10', type: 'emergency', color: '#ef4444', edgeId: 'E_PATIA_KIIT',      progressRatio: 0.45, direction: 1,  lane: 1,  baseSpeed: 0.0028 },
  { id: 'v11', type: 'car',       color: '#34d399', edgeId: 'E_KIIT_VANI',       progressRatio: 0.30, direction: 1,  lane: 1,  baseSpeed: 0.0020 },
  { id: 'v12', type: 'car',       color: '#ffffff', edgeId: 'E_JAYADEV_STATION', progressRatio: 0.55, direction: 1,  lane: 1,  baseSpeed: 0.0021 },
  { id: 'v13', type: 'ev',        color: '#06b6d4', edgeId: 'E_STATION_KHAN',    progressRatio: 0.40, direction: 1,  lane: 1,  baseSpeed: 0.0022 },
  { id: 'v14', type: 'car',       color: '#f87171', edgeId: 'E_KHAN_JAYADEV',    progressRatio: 0.65, direction: 1,  lane: 1,  baseSpeed: 0.0020 },
  { id: 'v15', type: 'bus',       color: '#f59e0b', edgeId: 'E_NK_KIIT',         progressRatio: 0.30, direction: 1,  lane: 1,  baseSpeed: 0.0016 },
  { id: 'v16', type: 'car',       color: '#38bdf8', edgeId: 'E_KIIT_STATION',    progressRatio: 0.70, direction: 1,  lane: 1,  baseSpeed: 0.0023 },
  { id: 'v17', type: 'car',       color: '#a855f7', edgeId: 'E_PATIA_JAYADEV',   progressRatio: 0.90, direction: 1,  lane: 1,  baseSpeed: 0.0019 },
  { id: 'v18', type: 'emergency', color: '#3b82f6', edgeId: 'E_JAYADEV_SAHEED',  progressRatio: 0.80, direction: -1, lane: -1, baseSpeed: 0.0029 }
];

// VEHICLE GRAPHIC SVG COMPONENT
const VehicleGraphic = ({ type, color }) => {
  if (type === 'bus') {
    return (
      <div style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.75))', display: 'flex', alignItems: 'center' }}>
        <svg width="24" height="10" viewBox="0 0 24 10" fill="none">
          <path d="M20 2.5 L24 0.5 L24 9.5 L20 7.5 Z" fill="rgba(254, 240, 138, 0.4)" />
          <rect x="2" y="1.5" width="18" height="7" rx="1.5" fill={color} stroke="#070b12" strokeWidth="0.8" />
          <rect x="5" y="3" width="12" height="4" rx="0.8" fill="#0f172a" opacity="0.85" />
          <circle cx="19.5" cy="2.5" r="0.8" fill="#fef08a" />
          <circle cx="19.5" cy="7.5" r="0.8" fill="#fef08a" />
          <circle cx="2.5" cy="2.5" r="0.7" fill="#ef4444" />
          <circle cx="2.5" cy="7.5" r="0.7" fill="#ef4444" />
        </svg>
      </div>
    );
  }

  if (type === 'emergency') {
    return (
      <div style={{ filter: 'drop-shadow(0 2px 6px rgba(239,68,68,0.8))', display: 'flex', alignItems: 'center' }}>
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
          <circle cx="10" cy="5" r="6" fill="rgba(239, 68, 68, 0.3)" />
          <path d="M16 2 L20 0 L20 10 L16 8 Z" fill="rgba(254, 240, 138, 0.45)" />
          <rect x="2" y="1" width="14" height="8" rx="1.8" fill="#ffffff" stroke="#ef4444" strokeWidth="1" />
          <rect x="8" y="3.5" width="2" height="3" fill="#ef4444" />
          <rect x="10" y="3.5" width="2" height="3" fill="#3b82f6" />
          <circle cx="15.5" cy="2.5" r="0.8" fill="#fef08a" />
          <circle cx="15.5" cy="7.5" r="0.8" fill="#fef08a" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.65))', display: 'flex', alignItems: 'center' }}>
      <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
        <path d="M14 2 L18 0.5 L18 8.5 L14 7 Z" fill="rgba(254, 240, 138, 0.35)" />
        <rect x="2" y="1" width="12" height="7" rx="1.5" fill={color} stroke="#070b12" strokeWidth="0.7" />
        <rect x="5" y="2.5" width="5.5" height="4" rx="0.8" fill="#0f172a" opacity="0.85" />
        <circle cx="13.5" cy="2.2" r="0.7" fill="#fef08a" />
        <circle cx="13.5" cy="6.8" r="0.7" fill="#fef08a" />
        <circle cx="2.5" cy="2.2" r="0.6" fill="#ef4444" />
        <circle cx="2.5" cy="6.8" r="0.6" fill="#ef4444" />
      </svg>
    </div>
  );
};

export default function LiveCityMap({ locations = [], selectedZone = "LOC-01", onSelectZone, mapHeight = '520px', userLocation = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const leafletVehiclesLayerRef = useRef(null);
  const leafletVehicleMarkersRef = useRef({});
  const imageContainerRef = useRef(null);
  
  const [mapMode, setMapMode] = useState('3d'); // '3d' | 'live' | 'satellite'
  const [showInspector, setShowInspector] = useState(false);
  const [trafficSeverityState, setTrafficSeverityState] = useState('Smooth'); // 'Smooth' | 'Moderate' | 'Heavy' | 'Severe'

  // Ref storing live vehicles state for high performance 60 FPS requestAnimationFrame loop
  const vehiclesRef = useRef(JSON.parse(JSON.stringify(INITIAL_VEHICLES)));
  const animationFrameRef = useRef(null);
  
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

  // DYNAMIC GRAPH ROAD NETWORK VEHICLE ANIMATION ENGINE (requestAnimationFrame)
  useEffect(() => {
    let lastTime = performance.now();

    const animateVehicles = (now) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Determine speed multiplier from traffic state
      const severityMultiplier = 
        trafficSeverityState === 'Severe' ? 0.20 :
        trafficSeverityState === 'Heavy' ? 0.45 :
        trafficSeverityState === 'Moderate' ? 0.72 : 1.0;

      const vehicles = vehiclesRef.current;

      // Group vehicles by edgeId for collision avoidance & safe spacing
      const edgeOccupancy = {};
      vehicles.forEach((v) => {
        if (!edgeOccupancy[v.edgeId]) edgeOccupancy[v.edgeId] = [];
        edgeOccupancy[v.edgeId].push(v);
      });

      vehicles.forEach((veh) => {
        const edge = EDGES_MAP[veh.edgeId];
        if (!edge) return;

        // Check for lead vehicle on the same edge and direction to maintain safe spacing
        let safeSpeedFactor = 1.0;
        const sames = edgeOccupancy[veh.edgeId] || [];
        sames.forEach((other) => {
          if (other.id === veh.id || other.direction !== veh.direction || other.lane !== veh.lane) return;
          
          const gap = veh.direction === 1 
            ? other.progressRatio - veh.progressRatio 
            : veh.progressRatio - other.progressRatio;

          if (gap > 0 && gap < 0.12) {
            safeSpeedFactor = Math.max(0, (gap - 0.03) / 0.09);
          }
        });

        // Intersection deceleration: slow down as vehicle approaches junction node
        let junctionSpeedFactor = 1.0;
        if (veh.progressRatio > 0.88 || veh.progressRatio < 0.12) {
          junctionSpeedFactor = 0.65;
        }

        // Severe traffic intersection signal pause simulation
        if (trafficSeverityState === 'Severe' && veh.stopTicks > 0) {
          veh.stopTicks--;
          safeSpeedFactor = 0;
        } else if (trafficSeverityState === 'Severe' && Math.random() < 0.002) {
          veh.stopTicks = Math.floor(60 + Math.random() * 90);
          safeSpeedFactor = 0;
        }

        // Advance vehicle along road polyline
        const stepSpeed = veh.baseSpeed * severityMultiplier * safeSpeedFactor * junctionSpeedFactor;
        veh.progressRatio += stepSpeed;

        // Check node arrival / intersection turning
        if (veh.progressRatio >= 1.0 || veh.progressRatio <= 0.0) {
          const reachedNodeId = veh.progressRatio >= 1.0 
            ? (veh.direction === 1 ? edge.to : edge.from)
            : (veh.direction === 1 ? edge.from : edge.to);

          const nextRoute = getConnectedNextEdge(reachedNodeId, veh.edgeId);
          veh.edgeId = nextRoute.edgeId;
          veh.direction = nextRoute.direction;
          veh.progressRatio = veh.direction === 1 ? 0.0 : 1.0;
        }

        // Compute sampled 3D percentage position & Leaflet GPS coordinates
        const pos = getPolylineSample(veh.edgeId, veh.progressRatio, veh.direction, veh.lane);

        veh.x = pos.x;
        veh.y = pos.y;
        veh.lat = pos.lat;
        veh.lng = pos.lng;
        veh.heading = pos.heading;

        // Direct DOM update for 3D Mode element (60 FPS Butter Smooth)
        const el3d = document.getElementById(`v3d-${veh.id}`);
        if (el3d) {
          el3d.style.left = `${pos.x}%`;
          el3d.style.top = `${pos.y}%`;
          el3d.style.transform = `translate(-50%, -50%) rotate(${pos.heading}deg)`;
        }

        // Direct update for Leaflet Mode marker
        const leafletMarker = leafletVehicleMarkersRef.current[veh.id];
        if (leafletMarker) {
          leafletMarker.setLatLng([pos.lat, pos.lng]);
          const iconEl = leafletMarker.getElement();
          if (iconEl) {
            const svgEl = iconEl.querySelector('.vehicle-svg-container');
            if (svgEl) {
              svgEl.style.transform = `rotate(${pos.heading}deg)`;
            }
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animateVehicles);
    };

    animationFrameRef.current = requestAnimationFrame(animateVehicles);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trafficSeverityState]);

  // Leaflet map setup and lifecycle for 'live' or 'satellite' mode
  useEffect(() => {
    if (mapMode === 'live' || mapMode === 'satellite') {
      if (!mapContainerRef.current) return;

      const center = [activePin.lat || 20.2961, activePin.lng || 85.8245];

      const tileUrl = mapMode === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileAttribution = mapMode === 'satellite'
        ? '&copy; Esri, Maxar, Earthstar Geographics'
        : '&copy; OpenStreetMap contributors';

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: 13,
          zoomControl: false,
          attributionControl: true
        });

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: tileAttribution,
          maxZoom: 19
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;

        const vehiclesGroup = L.layerGroup().addTo(map);
        leafletVehiclesLayerRef.current = vehiclesGroup;

        mapInstanceRef.current = map;
      } else {
        if (tileLayerRef.current) {
          tileLayerRef.current.setUrl(tileUrl);
        }
      }

      // Smoothly update center view
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom() || 13);
      }

      // Render interactive markers on Leaflet map
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();

        BHUBANESWAR_ZONES.forEach((zone) => {
          const isActive = activePin.id === zone.id || activePin.name === zone.name;
          const riskColor = zone.risk === 'High Risk' ? '#f43f5e' : (zone.risk === 'Medium Risk' ? '#f59e0b' : '#34d399');
          const bg = isActive ? '#2563eb' : '#0f172a';
          const border = isActive ? '2px solid #38bdf8' : `1.5px solid ${riskColor}`;

          const iconHtml = `
            <div style="
              background: ${bg};
              border: ${border};
              border-radius: 8px;
              padding: 4px 8px;
              color: #ffffff;
              font-family: Inter, system-ui, sans-serif;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 4px 14px rgba(0,0,0,0.6);
              display: flex;
              align-items: center;
              gap: 5px;
              cursor: pointer;
            ">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${riskColor}; box-shadow: 0 0 6px ${riskColor};"></span>
              <span>${zone.name}</span>
              <span style="font-size: 9px; opacity: 0.85; background: rgba(255,255,255,0.15); padding: 1px 4px; border-radius: 3px;">${zone.speed} km/h</span>
            </div>
          `;

          const customIcon = L.divIcon({
            className: 'custom-leaflet-zone-marker',
            html: iconHtml,
            iconSize: [120, 28],
            iconAnchor: [60, 14]
          });

          const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });

          marker.on('click', () => {
            const updated = { ...zone, isUserLocation: false };
            setActivePin(updated);
            if (onSelectZone) onSelectZone(updated);
          });

          markersLayerRef.current.addLayer(marker);
        });
      }

      // Render Leaflet vehicle markers
      if (leafletVehiclesLayerRef.current) {
        leafletVehiclesLayerRef.current.clearLayers();
        leafletVehicleMarkersRef.current = {};

        vehiclesRef.current.forEach((veh) => {
          const vehHtml = `
            <div class="vehicle-svg-container" style="
              transform: rotate(${veh.heading || 0}deg);
              transition: transform 0.05s linear;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <rect x="2" y="1" width="14" height="8" rx="1.5" fill="${veh.color}" stroke="#000000" stroke-width="0.8" />
                <rect x="5.5" y="2.5" width="6" height="5" rx="0.8" fill="#0f172a" opacity="0.85" />
                <circle cx="15.5" cy="2.5" r="0.8" fill="#fef08a" />
                <circle cx="15.5" cy="7.5" r="0.8" fill="#fef08a" />
              </svg>
            </div>
          `;

          const vehIcon = L.divIcon({
            className: 'leaflet-vehicle-marker',
            html: vehHtml,
            iconSize: [20, 10],
            iconAnchor: [10, 5]
          });

          const marker = L.marker([veh.lat || 20.3588, veh.lng || 85.8184], { icon: vehIcon });
          leafletVehiclesLayerRef.current.addLayer(marker);
          leafletVehicleMarkersRef.current[veh.id] = marker;
        });
      }

      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mapMode, activePin]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current && (mapMode === 'live' || mapMode === 'satellite')) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapMode]);

  // Cleanup Leaflet map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
      <div 
        ref={imageContainerRef}
        onClick={handleMapClick}
        onWheel={handle3dWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          display: mapMode === '3d' ? 'block' : 'none',
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
          {/* 3D DIGITAL TWIN MAP VISUALIZATION */}
          <img 
            src="/photorealistic_gis_satellite_map.png" 
            alt="Bhubaneswar 3D Digital Twin Command Map" 
            style={{ 
              width: '100%', 
              height: 'calc(100% - 42px)', 
              objectFit: 'cover',
              objectPosition: 'center center',
              imageRendering: '-webkit-optimize-contrast',
              filter: 'contrast(1.05) saturate(1.08) brightness(1.02)',
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

          {/* DYNAMIC MOVING VEHICLES OVER 3D DIGITAL TWIN MAP ROADS */}
          {INITIAL_VEHICLES.map((v) => (
            <div
              key={v.id}
              id={`v3d-${v.id}`}
              style={{
                position: 'absolute',
                top: `${v.y || 38}%`,
                left: `${v.x || 48}%`,
                transform: `translate(-50%, -50%) rotate(${v.heading || 0}deg)`,
                pointerEvents: 'none',
                zIndex: 8,
                willChange: 'transform, left, top'
              }}
            >
              <VehicleGraphic type={v.type} color={v.color} />
            </div>
          ))}

          {/* SUBTLE GIS RADAR ZONE & PROFESSIONAL LOCATION PIN */}
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
            {/* SUBTLE GIS RADAR CIRCLE */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '140px', 
                height: '80px', 
                borderRadius: '50%', 
                background: activePin.isUserLocation
                  ? 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)'
                  : 'radial-gradient(ellipse at center, rgba(2, 132, 199, 0.2) 0%, rgba(2, 132, 199, 0) 70%)',
                border: activePin.isUserLocation ? '1px dashed rgba(16, 185, 129, 0.6)' : '1px dashed rgba(56, 189, 248, 0.6)',
                boxShadow: activePin.isUserLocation ? '0 0 12px rgba(16, 185, 129, 0.2)' : '0 0 12px rgba(56, 189, 248, 0.2)',
                pointerEvents: 'none'
              }} 
            />

            {/* PROFESSIONAL GIS TELEMETRY BADGE & PIN */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{ 
                  background: 'rgba(11, 17, 30, 0.94)', 
                  color: '#ffffff', 
                  padding: '5px 12px', 
                  borderRadius: '8px', 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  boxShadow: '0 4px 14px rgba(0,0,0,0.6)', 
                  border: activePin.isUserLocation ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(56, 189, 248, 0.5)',
                  backdropFilter: 'blur(10px)',
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
                <span style={{ fontSize: '0.66rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8', fontWeight: 600 }}>
                  {activePin.speed} km/h • {activePin.aqi} AQI
                </span>
                <Maximize2 size={12} color="#94a3b8" style={{ marginLeft: '2px' }} />
              </div>

              {/* Clean Map Pin Icon */}
              <div style={{ width: '24px', height: '30px', marginTop: '2px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))' }}>
                <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill={activePin.isUserLocation ? '#10b981' : '#0284c7'}/>
                  <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
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

      {/* LEAFLET INTERACTIVE CONTAINER FOR LIVE MAP & SATELLITE MODES */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          display: mapMode !== '3d' ? 'block' : 'none', 
          position: 'relative', 
          width: '100%', 
          height: 'calc(100% - 42px)', 
          zIndex: 2 
        }} 
      />

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
              setTrafficSeverityState('Smooth');
              const lowZone = BHUBANESWAR_ZONES.find(z => z.risk === 'Low Risk');
              if (lowZone) setActivePin({ ...lowZone, isUserLocation: false });
            }}
            style={{ 
              background: trafficSeverityState === 'Smooth' ? 'rgba(16, 185, 129, 0.2)' : 'none', 
              border: trafficSeverityState === 'Smooth' ? '1px solid rgba(16, 185, 129, 0.5)' : 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#34d399', 
              fontSize: '0.74rem', 
              fontWeight: 700, 
              padding: '3px 8px', 
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            title="Highlight Smooth Traffic Speed"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span>Smooth</span>
          </button>

          <button 
            onClick={() => {
              setTrafficSeverityState('Moderate');
              const medZone = BHUBANESWAR_ZONES.find(z => z.risk === 'Medium Risk' || z.risk === 'Moderate');
              if (medZone) setActivePin({ ...medZone, isUserLocation: false });
            }}
            style={{ 
              background: trafficSeverityState === 'Moderate' ? 'rgba(245, 158, 11, 0.2)' : 'none', 
              border: trafficSeverityState === 'Moderate' ? '1px solid rgba(245, 158, 11, 0.5)' : 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#fbbf24', 
              fontSize: '0.74rem', 
              fontWeight: 700, 
              padding: '3px 8px', 
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            title="Highlight Moderate Traffic Speed"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span>Moderate</span>
          </button>

          <button 
            onClick={() => {
              setTrafficSeverityState('Heavy');
              const heavyZone = BHUBANESWAR_ZONES.find(z => z.name.includes('Station') || z.speed < 20);
              if (heavyZone) setActivePin({ ...heavyZone, isUserLocation: false });
            }}
            style={{ 
              background: trafficSeverityState === 'Heavy' ? 'rgba(251, 146, 60, 0.2)' : 'none', 
              border: trafficSeverityState === 'Heavy' ? '1px solid rgba(251, 146, 60, 0.5)' : 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#fb923c', 
              fontSize: '0.74rem', 
              fontWeight: 700, 
              padding: '3px 8px', 
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            title="Highlight Heavy Traffic Speed"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316', boxShadow: '0 0 6px #f97316' }} />
            <span>Heavy</span>
          </button>

          <button 
            onClick={() => {
              setTrafficSeverityState('Severe');
              const highZone = BHUBANESWAR_ZONES.find(z => z.risk === 'High Risk');
              if (highZone) setActivePin({ ...highZone, isUserLocation: false });
            }}
            style={{ 
              background: trafficSeverityState === 'Severe' ? 'rgba(244, 63, 94, 0.2)' : 'none', 
              border: trafficSeverityState === 'Severe' ? '1px solid rgba(244, 63, 94, 0.5)' : 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#fb7185', 
              fontSize: '0.74rem', 
              fontWeight: 700, 
              padding: '3px 8px', 
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            title="Highlight Severe Traffic Speed"
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
