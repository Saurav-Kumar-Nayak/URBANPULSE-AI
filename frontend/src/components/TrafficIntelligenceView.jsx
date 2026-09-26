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

const BHUBANESWAR_CORRIDORS = [
  { 
    id: 1, 
    name: 'Jayadev Vihar Junction', 
    avgSpeed: '19.7 km/h', 
    congestion: 69, 
    status: 'severe', 
    color: '#ef4444', 
    weight: 7,
    points: [
      [20.2980, 85.8245],
      [20.3120, 85.8235],
      [20.3280, 85.8215],
      [20.3440, 85.8195],
      [20.3588, 85.8184]
    ]
  },
  { 
    id: 2, 
    name: 'Bhubaneswar Railway Station', 
    avgSpeed: '20.4 km/h', 
    congestion: 65, 
    status: 'heavy', 
    color: '#f97316', 
    weight: 6,
    points: [
      [20.2650, 85.8400],
      [20.2750, 85.8380],
      [20.2885, 85.8420],
      [20.2910, 85.8580]
    ]
  },
  { 
    id: 3, 
    name: 'Patia Main Road', 
    avgSpeed: '28.5 km/h', 
    congestion: 32, 
    status: 'smooth', 
    color: '#10b981', 
    weight: 6,
    points: [
      [20.3588, 85.8184],
      [20.3620, 85.8080],
      [20.3660, 85.7980],
      [20.3700, 85.7880]
    ]
  },
  { 
    id: 4, 
    name: 'Nandankanan Road', 
    avgSpeed: '24.9 km/h', 
    congestion: 58, 
    status: 'heavy', 
    color: '#f59e0b', 
    weight: 6,
    points: [
      [20.3700, 85.8300],
      [20.3550, 85.8320],
      [20.3350, 85.8340],
      [20.3150, 85.8320],
      [20.2980, 85.8245]
    ]
  },
  { 
    id: 5, 
    name: 'KIIT Road', 
    avgSpeed: '28.2 km/h', 
    congestion: 53, 
    status: 'moderate', 
    color: '#f59e0b', 
    weight: 6,
    points: [
      [20.3530, 85.8150],
      [20.3560, 85.8250],
      [20.3600, 85.8350],
      [20.3650, 85.8450]
    ]
  },
  {
    id: 6,
    name: 'Khandagiri Bypass Highway',
    avgSpeed: '34.1 km/h',
    congestion: 28,
    status: 'smooth',
    color: '#10b981',
    weight: 6,
    points: [
      [20.2600, 85.7850],
      [20.2750, 85.7980],
      [20.2880, 85.8120],
      [20.2980, 85.8245]
    ]
  }
];

const TOP_CORRIDORS = BHUBANESWAR_CORRIDORS;

const INCIDENTS_DATA = [
  { id: 'inc-1', type: 'Accident', location: 'Jayadev Vihar Junction', impact: 'High', time: '10:38 PM', severityColor: '#ef4444', lat: 20.2980, lng: 85.8245, status: 'Active Emergency Dispatch' },
  { id: 'inc-2', type: 'Road Construction', location: 'Nandankanan Road', impact: 'Moderate', time: '10:19 PM', severityColor: '#f59e0b', lat: 20.3550, lng: 85.8320, status: 'Lane Restrict 1/2' },
  { id: 'inc-3', type: 'Signal Failure', location: 'Patia Main Road', impact: 'Moderate', time: '10:12 PM', severityColor: '#f59e0b', lat: 20.3588, lng: 85.8184, status: 'Manual Controller Onsite' },
  { id: 'inc-4', type: 'Road Closure', location: 'KIIT Square', impact: 'High', time: '09:58 PM', severityColor: '#ef4444', lat: 20.3530, lng: 85.8150, status: 'Duct Maintenance' },
  { id: 'inc-5', type: 'Vehicle Breakdown', location: 'Bhubaneswar Railway Station', impact: 'Low', time: '09:41 PM', severityColor: '#27d17f', lat: 20.2650, lng: 85.8400, status: 'Towing Unit En Route' }
];

const CAMERA_LOCATIONS = [
  { id: 'cam-101', name: 'Jayadev Vihar Junction 4K', lat: 20.2985, lng: 85.8248, status: 'online', uptime: '99.8%' },
  { id: 'cam-102', name: 'Patia Main Square Feed', lat: 20.3592, lng: 85.8188, status: 'online', uptime: '100%' },
  { id: 'cam-103', name: 'Nandankanan Rd Corridor', lat: 20.3555, lng: 85.8322, status: 'online', uptime: '98.9%' },
  { id: 'cam-104', name: 'Saheed Nagar Entry Gate', lat: 20.2888, lng: 85.8422, status: 'offline', uptime: '89.2%' },
  { id: 'cam-105', name: 'Railway Station Plaza Cam', lat: 20.2655, lng: 85.8405, status: 'online', uptime: '99.1%' },
  { id: 'cam-106', name: 'KIIT Square Traffic Sensor', lat: 20.3535, lng: 85.8155, status: 'maintenance', uptime: '94.0%' },
  { id: 'cam-107', name: 'Vani Vihar Flyover Cam', lat: 20.2915, lng: 85.8585, status: 'online', uptime: '99.6%' }
];

// INITIAL SIMULATED VEHICLE FLEET CONSTRAINED TO ROAD POLYLINES
const INITIAL_VEHICLES = [
  { id: 'v1', type: 'car', color: '#38bdf8', corridorIndex: 0, progress: 0.15, direction: 1, lane: 1, baseSpeed: 0.0018 },
  { id: 'v2', type: 'car', color: '#34d399', corridorIndex: 0, progress: 0.65, direction: 1, lane: 1, baseSpeed: 0.0022 },
  { id: 'v3', type: 'bus', color: '#f59e0b', corridorIndex: 0, progress: 0.40, direction: -1, lane: -1, baseSpeed: 0.0014 },
  { id: 'v4', type: 'car', color: '#ffffff', corridorIndex: 1, progress: 0.20, direction: 1, lane: 1, baseSpeed: 0.0020 },
  { id: 'v5', type: 'car', color: '#f87171', corridorIndex: 1, progress: 0.70, direction: 1, lane: 1, baseSpeed: 0.0023 },
  { id: 'v6', type: 'twowheeler', color: '#06b6d4', corridorIndex: 1, progress: 0.50, direction: -1, lane: -1, baseSpeed: 0.0026 },
  { id: 'v7', type: 'car', color: '#a855f7', corridorIndex: 2, progress: 0.35, direction: 1, lane: 1, baseSpeed: 0.0028 },
  { id: 'v8', type: 'bus', color: '#f59e0b', corridorIndex: 2, progress: 0.60, direction: -1, lane: -1, baseSpeed: 0.0018 },
  { id: 'v9', type: 'truck', color: '#eab308', corridorIndex: 3, progress: 0.25, direction: 1, lane: 1, baseSpeed: 0.0012 },
  { id: 'v10', type: 'car', color: '#ef4444', corridorIndex: 3, progress: 0.75, direction: -1, lane: -1, baseSpeed: 0.0019 },
  { id: 'v11', type: 'twowheeler', color: '#38bdf8', corridorIndex: 4, progress: 0.30, direction: 1, lane: 1, baseSpeed: 0.0027 },
  { id: 'v12', type: 'car', color: '#34d399', corridorIndex: 4, progress: 0.80, direction: -1, lane: -1, baseSpeed: 0.0022 },
  { id: 'v13', type: 'car', color: '#38bdf8', corridorIndex: 5, progress: 0.40, direction: 1, lane: 1, baseSpeed: 0.0030 },
  { id: 'v14', type: 'bus', color: '#f59e0b', corridorIndex: 5, progress: 0.70, direction: -1, lane: -1, baseSpeed: 0.0020 }
];

// POLYLINE INTERPOLATION WITH TANGENT HEADING AND LANE DISPLACEMENT
const getPolylineSample = (points, progress, direction = 1, lane = 1) => {
  if (!points || points.length < 2) return { lat: 20.2961, lng: 85.8245, heading: 0 };

  const totalSegments = points.length - 1;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const scaledIndex = clampedProgress * totalSegments;
  const segIdx = Math.min(Math.floor(scaledIndex), totalSegments - 1);
  const t = scaledIndex - segIdx;

  const p1 = points[segIdx];
  const p2 = points[segIdx + 1];

  const baseLat = p1[0] + (p2[0] - p1[0]) * t;
  const baseLng = p1[1] + (p2[1] - p1[1]) * t;

  const dLat = p2[0] - p1[0];
  const dLng = p2[1] - p1[1];
  const angleRad = Math.atan2(dLat, dLng);
  const headingDeg = direction === 1 
    ? Math.round(angleRad * (180 / Math.PI)) 
    : Math.round((angleRad + Math.PI) * (180 / Math.PI));

  // Perpendicular lane displacement (approx 15-20 meters offset)
  const laneOffsetGis = 0.00018;
  const perpLat = -Math.sin(angleRad) * laneOffsetGis * lane * direction;
  const perpLng = Math.cos(angleRad) * laneOffsetGis * lane * direction;

  return {
    lat: baseLat + perpLat,
    lng: baseLng + perpLng,
    heading: headingDeg
  };
};


export default function TrafficIntelligenceView() {
  const [userLocation, setUserLocation] = useState(CITY_PRESETS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('10:42:22 PM');
  const [layersOpen, setLayersOpen] = useState(false);

  const [mapStyle, setMapStyle] = useState('Dark GIS'); // 'Dark GIS' | 'Vibrant Street' | 'Satellite'
  const [selectedCorridorId, setSelectedCorridorId] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const mapTileLayerRef = useRef(null);
  const mapLabelsLayerRef = useRef(null);

  const trafficMapContainerRef = useRef(null);
  const trafficMapInstanceRef = useRef(null);
  const trafficLayerGroupRef = useRef(null);
  const vehicleLayerGroupRef = useRef(null);
  const leafletVehicleMarkersRef = useRef({});

  const vehiclesRef = useRef(JSON.parse(JSON.stringify(INITIAL_VEHICLES)));
  const animationFrameRef = useRef(null);

  const [gisLayers, setGisLayers] = useState({
    trafficFlow: true,
    incidents: true,
    roadClosures: true,
    construction: true,
    cameras: true,
    vehicles: true
  });

  const handleToggleLayer = (layerKey) => {
    setGisLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Helper to update map tile layers with professional GIS basemaps
  const updateMapTiles = (map, style) => {
    if (mapTileLayerRef.current) map.removeLayer(mapTileLayerRef.current);
    if (mapLabelsLayerRef.current) map.removeLayer(mapLabelsLayerRef.current);

    if (style === 'Vibrant Street') {
      // CartoDB Voyager High-Contrast Cartographic Basemap
      mapTileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);
      mapLabelsLayerRef.current = null;
    } else if (style === 'Satellite') {
      // Esri World Imagery Satellite + Reference Place Labels
      mapTileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: '&copy; Esri & Maxar'
      }).addTo(map);
      mapLabelsLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);
    } else {
      // CartoDB Dark Matter Enterprise GIS Basemap
      mapTileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);
      mapLabelsLayerRef.current = null;
    }
  };

  // Switch map style effect
  useEffect(() => {
    if (trafficMapInstanceRef.current) {
      updateMapTiles(trafficMapInstanceRef.current, mapStyle);
    }
  }, [mapStyle]);

  // Handle corridor selection click (Highlights polyline & pans/zooms map)
  const handleSelectCorridor = (corridor) => {
    setSelectedCorridorId(corridor.id);
    if (trafficMapInstanceRef.current && corridor.points && corridor.points.length > 0) {
      const bounds = L.latLngBounds(corridor.points);
      trafficMapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  };

  // Handle incident selection click (Pans/zooms to incident GPS point)
  const handleSelectIncident = (inc) => {
    setSelectedIncidentId(inc.id);
    if (trafficMapInstanceRef.current && inc.lat && inc.lng) {
      trafficMapInstanceRef.current.setView([inc.lat, inc.lng], 16, { animate: true });
    }
  };

  // 60 FPS RequestAnimationFrame Vehicle Navigation Engine
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now) => {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      if (gisLayers.vehicles) {
        vehiclesRef.current.forEach((veh) => {
          const corridor = BHUBANESWAR_CORRIDORS[veh.corridorIndex];
          if (!corridor || !corridor.points) return;

          // Adjust speed based on corridor congestion level
          const speedMultiplier = corridor.status === 'severe' ? 0.35 : (corridor.status === 'heavy' ? 0.6 : 1.0);
          veh.progress += veh.baseSpeed * veh.direction * speedMultiplier;

          if (veh.progress > 1.0) {
            veh.progress = 1.0;
            veh.direction = -1;
          } else if (veh.progress < 0.0) {
            veh.progress = 0.0;
            veh.direction = 1;
          }

          const sample = getPolylineSample(corridor.points, veh.progress, veh.direction, veh.lane);

          const marker = leafletVehicleMarkersRef.current[veh.id];
          if (marker) {
            marker.setLatLng([sample.lat, sample.lng]);
            const iconEl = marker.getElement();
            if (iconEl) {
              const rotContainer = iconEl.querySelector('.vehicle-rotator');
              if (rotContainer) {
                rotContainer.style.transform = `rotate(${sample.heading}deg)`;
              }
            }
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gisLayers.vehicles]);

  // Initialize & Update Traffic GIS Map
  useEffect(() => {
    if (!trafficMapContainerRef.current) return;

    if (!trafficMapInstanceRef.current) {
      const map = L.map(trafficMapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      updateMapTiles(map, mapStyle);

      const layerGroup = L.layerGroup().addTo(map);
      const vehicleGroup = L.layerGroup().addTo(map);

      trafficLayerGroupRef.current = layerGroup;
      vehicleLayerGroupRef.current = vehicleGroup;
      trafficMapInstanceRef.current = map;

      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);
    } else {
      trafficMapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
      setTimeout(() => {
        if (trafficMapInstanceRef.current) trafficMapInstanceRef.current.invalidateSize();
      }, 200);
    }

    // Render Real GIS Road Geometry Polylines, Incidents, Cameras & Vehicles
    if (trafficLayerGroupRef.current) {
      trafficLayerGroupRef.current.clearLayers();

      // 1. REAL ROAD TRAFFIC FLOW POLYLINES
      if (gisLayers.trafficFlow) {
        BHUBANESWAR_CORRIDORS.forEach((corridor) => {
          const isSelected = selectedCorridorId === corridor.id;
          const polyWeight = isSelected ? 10 : corridor.weight;
          const opacity = isSelected ? 1.0 : 0.88;

          const polyline = L.polyline(corridor.points, {
            color: corridor.color,
            weight: polyWeight,
            opacity: opacity,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(trafficLayerGroupRef.current);

          polyline.bindTooltip(
            `<div style="font-family: sans-serif; font-size: 11px;">` +
              `<strong style="color: ${corridor.color}">${corridor.name}</strong><br/>` +
              `Status: ${corridor.status.toUpperCase()} (${corridor.avgSpeed})<br/>` +
              `Congestion Index: ${corridor.congestion}%` +
            `</div>`, 
            { permanent: false }
          );

          polyline.on('click', () => handleSelectCorridor(corridor));
        });
      }

      // 2. INCIDENTS MARKERS
      if (gisLayers.incidents) {
        INCIDENTS_DATA.forEach((inc) => {
          const isSelected = selectedIncidentId === inc.id;
          const borderStyle = isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.8)';
          const boxGlow = isSelected ? `0 0 16px ${inc.severityColor}` : `0 2px 8px rgba(0,0,0,0.5)`;

          const incHtml = `
            <div style="background:${inc.severityColor}; color:#fff; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:13px; box-shadow:${boxGlow}; border:${borderStyle}; cursor:pointer;">
              ${inc.type === 'Accident' ? '🚨' : inc.type === 'Signal Failure' ? '🚦' : inc.type === 'Road Closure' ? '⛔' : '🚧'}
            </div>
          `;

          const incMarker = L.marker([inc.lat, inc.lng], {
            icon: L.divIcon({ html: incHtml, className: 'incident-gis-icon', iconSize: [28, 28], iconAnchor: [14, 14] })
          }).bindPopup(
            `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">` +
              `<strong style="color:${inc.severityColor}">${inc.type}</strong><br/>` +
              `<b>${inc.location}</b><br/>` +
              `Impact: ${inc.impact} • ${inc.time}<br/>` +
              `<span style="color: #91A4C5">${inc.status}</span>` +
            `</div>`
          ).addTo(trafficLayerGroupRef.current);

          incMarker.on('click', () => setSelectedIncidentId(inc.id));
        });
      }

      // 3. CAMERAS MARKERS
      if (gisLayers.cameras) {
        CAMERA_LOCATIONS.forEach((cam) => {
          const statusBg = cam.status === 'online' ? '#0284c7' : (cam.status === 'offline' ? '#ef4444' : '#f59e0b');
          const camHtml = `
            <div style="background:${statusBg}; color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-size:11px; box-shadow:0 0 8px ${statusBg}; border:1.5px solid #fff; cursor:pointer;">
              📹
            </div>
          `;

          L.marker([cam.lat, cam.lng], {
            icon: L.divIcon({ html: camHtml, className: 'cam-gis-icon', iconSize: [24, 24], iconAnchor: [12, 12] })
          }).bindPopup(
            `<div style="font-family: sans-serif; font-size: 11px;">` +
              `<strong>${cam.name}</strong><br/>` +
              `Status: <span style="text-transform:uppercase; font-weight:bold; color:${statusBg}">${cam.status}</span><br/>` +
              `System Uptime: ${cam.uptime}` +
            `</div>`
          ).addTo(trafficLayerGroupRef.current);
        });
      }

      // 4. CENTRAL COMMAND NODE
      const userMarkerHtml = `
        <div style="position: relative; width: 28px; height: 28px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(30, 167, 255, 0.4); animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position: absolute; inset: 4px; border-radius: 50%; background: #1EA7FF; border: 2px solid #ffffff; box-shadow: 0 0 12px rgba(30, 167, 255, 0.9);"></div>
        </div>
      `;
      const userIcon = L.divIcon({ html: userMarkerHtml, className: 'custom-traffic-user-icon', iconSize: [28, 28], iconAnchor: [14, 14] });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup(`<b>${userLocation.city} Control Center Node</b><br/>Congestion: ${Math.round(userLocation.congestion * 100)}%`)
        .addTo(trafficLayerGroupRef.current);
    }

    // 5. VEHICLE TELEMETRY MARKERS LAYER
    if (vehicleLayerGroupRef.current) {
      vehicleLayerGroupRef.current.clearLayers();
      leafletVehicleMarkersRef.current = {};

      if (gisLayers.vehicles) {
        vehiclesRef.current.forEach((veh) => {
          const corridor = BHUBANESWAR_CORRIDORS[veh.corridorIndex];
          if (!corridor || !corridor.points) return;

          const sample = getPolylineSample(corridor.points, veh.progress, veh.direction, veh.lane);

          let svgContent = '';
          if (veh.type === 'bus') {
            svgContent = `<svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="2" y="1" width="18" height="8" rx="1.5" fill="${veh.color}" stroke="#000" stroke-width="0.8"/><circle cx="18" cy="3" r="0.8" fill="#fef08a"/><circle cx="18" cy="7" r="0.8" fill="#fef08a"/></svg>`;
          } else if (veh.type === 'truck') {
            svgContent = `<svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="2" y="1" width="14" height="9" rx="1" fill="${veh.color}" stroke="#000" stroke-width="0.8"/><rect x="16" y="2" width="6" height="7" rx="1" fill="#475569"/><circle cx="21" cy="3.5" r="0.8" fill="#fef08a"/></svg>`;
          } else if (veh.type === 'twowheeler') {
            svgContent = `<svg width="14" height="7" viewBox="0 0 14 7" fill="none"><rect x="2" y="1" width="10" height="5" rx="1" fill="${veh.color}" stroke="#000" stroke-width="0.6"/><circle cx="11" cy="2" r="0.6" fill="#fef08a"/></svg>`;
          } else {
            svgContent = `<svg width="18" height="9" viewBox="0 0 18 9" fill="none"><rect x="2" y="1" width="14" height="7" rx="1.5" fill="${veh.color}" stroke="#000" stroke-width="0.8"/><circle cx="14.5" cy="2.5" r="0.7" fill="#fef08a"/><circle cx="14.5" cy="6.5" r="0.7" fill="#fef08a"/></svg>`;
          }

          const vehHtml = `
            <div class="vehicle-rotator" style="transform: rotate(${sample.heading}deg); transition: transform 0.05s linear; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));">
              ${svgContent}
            </div>
          `;

          const vMarker = L.marker([sample.lat, sample.lng], {
            icon: L.divIcon({ className: 'vehicle-gis-marker', html: vehHtml, iconSize: [22, 10], iconAnchor: [11, 5] })
          });

          vehicleLayerGroupRef.current.addLayer(vMarker);
          leafletVehicleMarkersRef.current[veh.id] = vMarker;
        });
      }
    }
  }, [userLocation, gisLayers, selectedCorridorId, selectedIncidentId]);

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
          background: linear-gradient(145deg, rgba(13, 21, 36, 0.92) 0%, rgba(8, 14, 24, 0.96) 100%);
          border: 1px solid rgba(120, 170, 255, 0.16);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 
            0 16px 36px -10px rgba(0, 0, 0, 0.75),
            0 0 20px rgba(6, 182, 212, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: relative;
          overflow: hidden;
        }
        .enterprise-traffic-card:hover {
          border-color: rgba(32, 217, 255, 0.45);
          transform: translateY(-5px);
          box-shadow: 
            0 24px 50px -12px rgba(0, 0, 0, 0.88),
            0 0 35px rgba(32, 217, 255, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
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
                checked={gisLayers.vehicles} 
                onChange={() => handleToggleLayer('vehicles')}
                style={{ cursor: 'pointer', accentColor: '#1EA7FF' }} 
              /> Live Vehicles
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
              {TOP_CORRIDORS.map((item) => {
                const isSelected = selectedCorridorId === item.id;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectCorridor(item)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 10px', 
                      background: isSelected ? 'rgba(30, 167, 255, 0.15)' : '#101E3A', 
                      borderRadius: '8px', 
                      fontSize: '0.76rem', 
                      border: isSelected ? '1px solid #1EA7FF' : '1px solid rgba(120, 170, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
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
                      <div style={{ fontSize: '0.6rem', color: '#20D9FF', textTransform: 'uppercase', fontWeight: 700 }}>Focus GIS</div>
                    </div>
                  </div>
                );
              })}
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
              {INCIDENTS_DATA.slice(0, 4).map((item) => {
                const isSelected = selectedIncidentId === item.id;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectIncident(item)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 10px', 
                      background: isSelected ? 'rgba(255, 90, 103, 0.15)' : '#101E3A', 
                      borderRadius: '8px', 
                      fontSize: '0.74rem', 
                      border: isSelected ? `1px solid ${item.severityColor}` : '1px solid rgba(120, 170, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
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
                );
              })}
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
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FF5A67' }}>11</div>
              </div>
              <div style={{ background: '#101E3A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(120, 170, 255, 0.1)' }}>
                <div style={{ fontSize: '0.64rem', color: '#91A4C5' }}>Maint.</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFB020' }}>5</div>
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
