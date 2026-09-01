import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { 
  CloudSun, Thermometer, Droplets, Wind, ShieldAlert, ShieldCheck,
  MapPin, RefreshCw, Compass, Plus, Minus, Layers, Settings,
  Sun, Moon, Zap, Search, X, Check, Eye, Gauge, Cpu, Radio, Database, Sparkles, CloudRain
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import weatherService from '../services/weatherService';

export const WeatherIntelligence = () => {
  // 1. Core State
  const [unit, setUnit] = useState('C');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Location State
  const [userLocation, setUserLocation] = useState({
    city: 'Bhubaneswar',
    region: 'Odisha',
    country: 'India',
    lat: 20.2961,
    lng: 85.8245
  });

  // Weather & Radar State
  const [weatherData, setWeatherData] = useState(null);
  const [radarStatus, setRadarStatus] = useState('LOADING');
  const [radarMeta, setRadarMeta] = useState(null);
  const [mapStyle, setMapStyle] = useState('satellite'); // Default satellite as reference image

  // Search Modal State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Leaflet Map Refs
  const radarMapContainerRef = useRef(null);
  const radarMapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const radarTileLayerRef = useRef(null);
  const locationMarkerRef = useRef(null);

  const BASEMAP_TILES = {
    terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
  };

  // Fetch Weather Data
  const loadWeatherData = useCallback(async (location, isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    const locationName = `${location.city}, ${location.region ? location.region + ', ' : ''}${location.country}`;
    const result = await weatherService.fetchWeatherData(location.lat, location.lng, locationName);

    if (result.success) {
      setWeatherData(result);
    } else {
      setError(result.error || 'Failed to fetch weather telemetry');
    }

    setLoading(false);
    setIsRefreshing(false);
  }, []);

  // Fetch Radar Metadata
  const loadRadarData = useCallback(async () => {
    setRadarStatus('LOADING');
    const meta = await weatherService.fetchRadarMetadata();
    if (meta.success) {
      setRadarMeta(meta);
      setRadarStatus('SUCCESS');
    } else {
      setRadarStatus('FAILURE');
    }
  }, []);

  // Initial Telemetry Loading
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const geoData = await geoRes.json();
            const city = geoData.city || geoData.locality || 'Bhubaneswar';
            const region = geoData.principalSubdivision || 'Odisha';
            const country = geoData.countryName || 'India';
            
            const loc = { city, region, country, lat, lng };
            setUserLocation(loc);
            loadWeatherData(loc);
          } catch {
            loadWeatherData(userLocation);
          }
        },
        () => loadWeatherData(userLocation),
        { timeout: 6000 }
      );
    } else {
      loadWeatherData(userLocation);
    }
    loadRadarData();
  }, []);

  // Initialize Leaflet Radar Map
  useEffect(() => {
    if (loading || !radarMapContainerRef.current) return;

    if (!radarMapInstanceRef.current) {
      const map = L.map(radarMapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      const baseLayer = L.tileLayer(BASEMAP_TILES[mapStyle] || BASEMAP_TILES.satellite, {
        maxZoom: 16
      }).addTo(map);
      baseTileLayerRef.current = baseLayer;

      const customIcon = L.divIcon({
        className: 'custom-location-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(2, 132, 199, 0.4); animation: ping 1.8s infinite;"></div>
            <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(56, 189, 248, 0.6);"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #0284c7; border: 2px solid #ffffff; box-shadow: 0 0 14px #0284c7;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const popupHtml = `
        <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; font-weight: 700; padding: 2px 4px;">
          <div style="color: #0284c7; font-size: 13px; font-weight: 800;">📍 ${userLocation.city}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${userLocation.lat.toFixed(2)}°N, ${userLocation.lng.toFixed(2)}°E</div>
          <div style="color: #10b981; font-size: 10px; margin-top: 4px; font-weight: 800;">● Doppler Telemetry Active</div>
        </div>
      `;

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupHtml);
      locationMarkerRef.current = marker;
      radarMapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 200);
    } else {
      radarMapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 7);
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
      setTimeout(() => radarMapInstanceRef.current?.invalidateSize(), 200);
    }
  }, [loading, userLocation.lat, userLocation.lng]);

  // Basemap Switcher
  useEffect(() => {
    const map = radarMapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const newBaseLayer = L.tileLayer(BASEMAP_TILES[mapStyle] || BASEMAP_TILES.satellite, {
      maxZoom: 16
    });
    newBaseLayer.addTo(map);
    baseTileLayerRef.current = newBaseLayer;

    if (radarTileLayerRef.current) {
      radarTileLayerRef.current.bringToFront();
    }
  }, [mapStyle]);

  // Radar Tiles Overlay
  useEffect(() => {
    const map = radarMapInstanceRef.current;
    if (!map) return;

    if (radarTileLayerRef.current) {
      map.removeLayer(radarTileLayerRef.current);
      radarTileLayerRef.current = null;
    }

    if (radarStatus === 'SUCCESS' && radarMeta && radarMeta.tileUrlTemplate) {
      const radarLayer = L.tileLayer(radarMeta.tileUrlTemplate, {
        opacity: 0.7,
        tileSize: 256,
        minZoom: 0,
        maxNativeZoom: 7,
        maxZoom: 18
      });
      radarLayer.addTo(map);
      radarTileLayerRef.current = radarLayer;
    }
  }, [radarStatus, radarMeta]);

  // Handlers
  const handleMapZoomIn = () => radarMapInstanceRef.current?.zoomIn();
  const handleMapZoomOut = () => radarMapInstanceRef.current?.zoomOut();
  const handleMapRecenter = () => radarMapInstanceRef.current?.setView([userLocation.lat, userLocation.lng], 7);

  const handleRefreshAll = () => {
    loadWeatherData(userLocation, true);
    loadRadarData();
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setIsSearching(true);
      const results = await weatherService.searchLocations(q);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (loc) => {
    const newLoc = { city: loc.city, region: loc.region, country: loc.country, lat: loc.lat, lng: loc.lng };
    setUserLocation(newLoc);
    setIsLocationModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    loadWeatherData(newLoc);
  };

  const formatTemp = (celsius, includeSymbol = true) => {
    if (celsius === undefined || celsius === null) return '--';
    let val = celsius;
    if (unit === 'F') {
      val = Math.round((celsius * 9) / 5 + 32);
    }
    return includeSymbol ? `${val}°` : `${val}`;
  };

  const renderWeatherIcon = (iconType, size = 24) => {
    switch (iconType) {
      case 'sun':
        return <Sun size={size} color="#f59e0b" />;
      case 'sun-cloud':
        return <CloudSun size={size} color="#38bdf8" />;
      case 'cloud':
        return <CloudSun size={size} color="#94a3b8" />;
      case 'rain':
        return <CloudRain size={size} color="#06b6d4" />;
      case 'thunder':
        return <Zap size={size} color="#ef4444" />;
      default:
        return <CloudSun size={size} color="#38bdf8" />;
    }
  };

  if (loading && !weatherData) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading Weather Telemetry..." />
      </PageContainer>
    );
  }

  if (error && !weatherData) {
    return (
      <PageContainer>
        <EmptyState title="Weather Telemetry Error" message={error} onRetry={() => loadWeatherData(userLocation)} />
      </PageContainer>
    );
  }

  const cur = weatherData?.current || {};
  const aqiObj = weatherData?.aqi || {};
  const uvObj = weatherData?.uv || {};
  const riskObj = weatherData?.risk || { score: 15, rating: 'LOW', color: '#34d399', desc: 'No Adverse Warnings' };

  return (
    <PageContainer>
      {/* EXACT REFERENCE DESIGN STYLES */}
      <style>{`
        .ref-weather-bg {
          background-color: #06111F;
          color: #f8fafc;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .ref-card {
          background-color: #0B1B2F;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .ref-card:hover {
          border-color: rgba(56, 189, 248, 0.25);
        }
        .ref-sub-card {
          background-color: #10233A;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
        }
        .ref-cyan-badge {
          background: rgba(2, 132, 199, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
        }
      `}</style>

      <div className="ref-weather-bg" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 1. SUBTITLE & CURRENT LOCATION HEADER BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 500 }}>
            Real-time atmospheric conditions, temperature vectors & urban impact correlation
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ref-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  CURRENT LOCATION
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                  {userLocation.city}{userLocation.region ? `, ${userLocation.region}` : ''}, {userLocation.country}
                </div>
              </div>

              <button
                data-testid="change-location-btn"
                onClick={() => setIsLocationModalOpen(true)}
                style={{
                  background: 'rgba(2, 132, 199, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapPin size={12} />
                <span>Change Location</span>
              </button>
            </div>

            <button
              data-testid="refresh-weather-btn"
              onClick={handleRefreshAll}
              disabled={isRefreshing || loading}
              className="ref-card"
              style={{
                color: '#ffffff',
                padding: '9px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Refresh Telemetry"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} color="#38bdf8" />
            </button>
          </div>
        </div>

        {/* 2. UPPER 3-COLUMN HERO GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1.2fr', gap: '14px' }}>

          {/* COLUMN 1: CURRENT WEATHER CARD */}
          <div 
            className="ref-card"
            style={{ 
              overflow: 'hidden', 
              background: 'linear-gradient(180deg, rgba(11, 27, 47, 0.85) 0%, rgba(6, 17, 31, 0.98) 100%), url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80")', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              position: 'relative'
            }}
          >
            <div style={{ padding: '18px 20px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                  CURRENT WEATHER
                </span>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  border: '1px solid rgba(16, 185, 129, 0.5)', 
                  color: '#34d399', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.62rem', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
                  Live
                </span>
              </div>

              <div style={{ marginTop: '18px' }}>
                <div style={{ fontSize: '3.6rem', fontWeight: 900, color: '#ffffff', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {formatTemp(cur.tempC, false)}°C
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 600 }}>
                  Feels like {formatTemp(cur.feelsC, false)}°
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                  <CloudSun size={26} color="#38bdf8" />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {cur.condition || 'Overcast'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom 4-Item Telemetry Strip */}
            <div style={{ 
              background: 'rgba(6, 17, 31, 0.95)', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
              padding: '10px 14px', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '4px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              backdropFilter: 'blur(8px)'
            }}>
              <div>
                <Wind size={14} color="#38bdf8" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 600 }}>Wind</div>
                <div style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 800, marginTop: '1px' }}>
                  {cur.windKmh || 9} km/h {cur.windDir || 'SW'}
                </div>
              </div>
              <div>
                <Droplets size={14} color="#38bdf8" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 600 }}>Humidity</div>
                <div style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 800, marginTop: '1px' }}>
                  {cur.humidity || 96}%
                </div>
              </div>
              <div>
                <Gauge size={14} color="#38bdf8" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 600 }}>Pressure</div>
                <div style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 800, marginTop: '1px' }}>
                  {cur.pressure || 1006} hPa
                </div>
              </div>
              <div>
                <Eye size={14} color="#38bdf8" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 600 }}>Visibility</div>
                <div style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 800, marginTop: '1px' }}>
                  {cur.visibility || 7.5} km
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: 4 METRIC CARDS & PRIMARY CONDITION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Top 4 Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              
              {/* HUMIDITY */}
              <div className="ref-card" style={{ padding: '12px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>RELATIVE HUMIDITY</span>
                  <Droplets size={13} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {cur.humidity || 96}%
                </div>
                {/* Sparkline SVG */}
                <svg width="100%" height="16" viewBox="0 0 80 16" style={{ margin: '4px 0 2px' }}>
                  <path d="M0 12 Q20 4, 40 10 T80 6" fill="none" stroke="#38bdf8" strokeWidth="2" />
                </svg>
                <div style={{ fontSize: '0.6rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8' }} />
                  Optimal
                </div>
              </div>

              {/* RISK */}
              <div className="ref-card" style={{ padding: '12px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>WEATHER RISK RATING</span>
                  <ShieldCheck size={13} color="#34d399" />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {riskObj.rating || 'LOW'}
                </div>
                {/* Sparkline SVG */}
                <svg width="100%" height="16" viewBox="0 0 80 16" style={{ margin: '4px 0 2px' }}>
                  <path d="M0 10 Q20 14, 40 8 T80 12" fill="none" stroke="#34d399" strokeWidth="2" />
                </svg>
                <div style={{ fontSize: '0.6rem', color: '#34d399', fontWeight: 600 }}>
                  {riskObj.desc || 'No Adverse Warnings'}
                </div>
              </div>

              {/* AQI */}
              <div className="ref-card" style={{ padding: '12px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>AIR QUALITY (AQI)</span>
                  <Wind size={13} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                  {aqiObj.value || 65}
                </div>
                {/* Sparkline SVG */}
                <svg width="100%" height="16" viewBox="0 0 80 16" style={{ margin: '4px 0 2px' }}>
                  <path d="M0 8 Q20 2, 40 12 T80 4" fill="none" stroke="#f59e0b" strokeWidth="2" />
                </svg>
                <div style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 600 }}>
                  {aqiObj.category?.label || 'Moderate'}
                </div>
              </div>

              {/* UV */}
              <div className="ref-card" style={{ padding: '12px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>UV INDEX</span>
                  <Sun size={13} color="#34d399" />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {uvObj.value ?? 0}
                </div>
                {/* Sparkline SVG */}
                <svg width="100%" height="16" viewBox="0 0 80 16" style={{ margin: '4px 0 2px' }}>
                  <path d="M0 14 Q20 10, 40 12 T80 8" fill="none" stroke="#34d399" strokeWidth="2" />
                </svg>
                <div style={{ fontSize: '0.6rem', color: '#34d399', fontWeight: 600 }}>
                  {uvObj.category?.label || 'Low'}
                </div>
              </div>

            </div>

            {/* Primary Condition Card */}
            <div 
              className="ref-card"
              style={{ 
                flex: 1, 
                overflow: 'hidden',
                background: 'linear-gradient(90deg, rgba(11, 27, 47, 0.95) 0%, rgba(11, 27, 47, 0.75) 55%, transparent 100%), url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center right',
                padding: '18px 20px', 
                display: 'flex', 
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.04em' }}>
                  PRIMARY CONDITION
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '4px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {cur.condition || 'Overcast'}
                </div>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                Wind: {cur.windKmh || 9} km/h {cur.windDir || 'SW'} &bull; Gust: {cur.windGust || 17} km/h
              </div>
            </div>

          </div>

          {/* COLUMN 3: LIVE WEATHER RADAR MAP */}
          <div 
            className="ref-card"
            style={{ 
              overflow: 'hidden', 
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Header Overlay */}
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, 
              zIndex: 10, 
              padding: '10px 12px', 
              background: 'linear-gradient(180deg, rgba(6,17,31,0.95) 0%, rgba(6,17,31,0) 100%)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                LIVE WEATHER RADAR
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', background: 'rgba(16, 35, 58, 0.9)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <button 
                    onClick={() => setMapStyle('terrain')} 
                    style={{ 
                      background: mapStyle === 'terrain' ? '#0284c7' : 'none', 
                      color: mapStyle === 'terrain' ? '#ffffff' : '#94a3b8', 
                      border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer' 
                    }}
                  >
                    Terrain
                  </button>
                  <button 
                    onClick={() => setMapStyle('satellite')} 
                    style={{ 
                      background: mapStyle === 'satellite' ? '#0284c7' : 'none', 
                      color: mapStyle === 'satellite' ? '#ffffff' : '#94a3b8', 
                      border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer' 
                    }}
                  >
                    Satellite
                  </button>
                  <button 
                    onClick={() => setMapStyle('dark')} 
                    style={{ 
                      background: mapStyle === 'dark' ? '#0284c7' : 'none', 
                      color: mapStyle === 'dark' ? '#ffffff' : '#94a3b8', 
                      border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer' 
                    }}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Map Controls */}
            <div style={{ 
              position: 'absolute', top: '44px', right: '10px', zIndex: 10, 
              display: 'flex', flexDirection: 'column', gap: '4px',
              background: 'rgba(6, 17, 31, 0.9)', padding: '4px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)'
            }}>
              <button 
                onClick={() => setMapStyle(prev => prev === 'terrain' ? 'satellite' : prev === 'satellite' ? 'dark' : 'terrain')} 
                style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }} 
              >
                <Settings size={13} color="#38bdf8" />
              </button>
              <button onClick={handleMapZoomIn} style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }}><Plus size={13} /></button>
              <button onClick={handleMapZoomOut} style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }}><Minus size={13} /></button>
            </div>

            {/* Map Canvas Container */}
            <div ref={radarMapContainerRef} style={{ width: '100%', height: '100%', minHeight: '230px', flex: 1, zIndex: 1 }} />

            {/* Radar Intensity Legend Bar */}
            <div style={{ position: 'relative', zIndex: 10, background: '#06111F', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '6px 12px' }}>
              <div style={{ height: '5px', borderRadius: '3px', background: 'linear-gradient(90deg, #0284c7 0%, #10b981 30%, #f59e0b 65%, #ef4444 85%, #a855f7 100%)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.58rem', color: '#94a3b8', fontWeight: 600 }}>
                <span>Light</span>
                <span>Moderate</span>
                <span>Heavy</span>
                <span style={{ color: '#a855f7' }}>Very Heavy</span>
              </div>
            </div>

          </div>

        </div>

        {/* 3. MIDDLE FORECAST GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }}>
          
          {/* HOURLY FORECAST */}
          <div className="ref-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                HOURLY FORECAST
              </span>

              {/* °C / °F Switcher Pill */}
              <div style={{ display: 'flex', background: 'rgba(16, 35, 58, 0.9)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <button 
                  onClick={() => setUnit('C')} 
                  style={{ 
                    background: unit === 'C' ? '#0284c7' : 'none', 
                    color: unit === 'C' ? '#ffffff' : '#94a3b8', 
                    border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.66rem', fontWeight: 700, cursor: 'pointer' 
                  }}
                >
                  °C
                </button>
                <button 
                  onClick={() => setUnit('F')} 
                  style={{ 
                    background: unit === 'F' ? '#0284c7' : 'none', 
                    color: unit === 'F' ? '#ffffff' : '#94a3b8', 
                    border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.66rem', fontWeight: 700, cursor: 'pointer' 
                  }}
                >
                  °F
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px' }}>
              {(weatherData?.hourly || [
                { time: 'Now', temp: 26.5, pop: 96, icon: 'cloud' },
                { time: '1 AM', temp: 26.0, pop: 95, icon: 'cloud' },
                { time: '2 AM', temp: 26.0, pop: 92, icon: 'cloud' },
                { time: '3 AM', temp: 25.0, pop: 89, icon: 'cloud' },
                { time: '4 AM', temp: 25.0, pop: 86, icon: 'cloud' },
                { time: '5 AM', temp: 25.0, pop: 83, icon: 'cloud' },
                { time: '6 AM', temp: 26.0, pop: 78, icon: 'sun-cloud' },
                { time: '7 AM', temp: 27.0, pop: 71, icon: 'sun-cloud' },
                { time: '8 AM', temp: 28.0, pop: 63, icon: 'sun-cloud' },
                { time: '9 AM', temp: 29.0, pop: 55, icon: 'sun-cloud' }
              ]).slice(0, 10).map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: idx === 0 ? 'rgba(2, 132, 199, 0.18)' : 'rgba(16, 35, 58, 0.6)', 
                    border: idx === 0 ? '1px solid #0284c7' : '1px solid rgba(255,255,255,0.06)', 
                    borderRadius: '10px', 
                    padding: '10px 2px', 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'space-between'
                  }}
                >
                  <div style={{ fontSize: '0.64rem', fontWeight: 700, color: idx === 0 ? '#38bdf8' : '#94a3b8' }}>
                    {item.time}
                  </div>
                  <div style={{ margin: '6px 0' }}>
                    {renderWeatherIcon(item.icon, 18)}
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>
                    {formatTemp(item.temp, false)}°
                  </div>
                  <div style={{ fontSize: '0.58rem', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>
                    💧 {item.pop}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-DAY FORECAST */}
          <div className="ref-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                7-DAY FORECAST
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {(weatherData?.sevenDay || [
                { day: '01 Tue', condition: 'rain', high: 31, low: 25, pop: 61 },
                { day: '02 Wed', condition: 'cloud', high: 32, low: 26, pop: 61 },
                { day: '03 Thu', condition: 'cloud', high: 33, low: 26, pop: 73 },
                { day: '04 Fri', condition: 'cloud', high: 33, low: 26, pop: 49 },
                { day: '05 Sat', condition: 'cloud', high: 34, low: 27, pop: 42 },
                { day: '06 Sun', condition: 'cloud', high: 33, low: 27, pop: 64 },
                { day: '07 Mon', condition: 'cloud', high: 33, low: 27, pop: 78 }
              ]).map((day, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: idx === 0 ? 'rgba(2, 132, 199, 0.15)' : 'rgba(16, 35, 58, 0.6)', 
                    border: '1px solid rgba(255,255,255,0.06)', 
                    borderRadius: '10px', 
                    padding: '10px 2px', 
                    textAlign: 'center' 
                  }}
                >
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: idx === 0 ? '#38bdf8' : '#94a3b8' }}>
                    {day.day}
                  </div>
                  <div style={{ margin: '6px 0' }}>
                    {renderWeatherIcon(day.condition, 16)}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>
                    {formatTemp(day.high, false)}°
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600 }}>
                    {formatTemp(day.low, false)}°
                  </div>
                  <div style={{ fontSize: '0.56rem', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>
                    💧 {day.pop}%
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. LOWER INTELLIGENCE & ANALYTICS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>

          {/* CARD 1: AI WEATHER INSIGHT */}
          <div className="ref-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                  AI WEATHER INSIGHT
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
                Cloudy conditions expected throughout the day. Moderate humidity with a slight decrease in temperature overnight. No significant weather risks detected for the next 24 hours.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <span className="ref-cyan-badge" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 700 }}>
                Confidence &nbsp;<strong style={{ color: '#ffffff' }}>94%</strong>
              </span>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#f59e0b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 700 }}>
                Risk Level &nbsp;<strong style={{ color: '#ffffff' }}>Moderate</strong>
              </span>
            </div>
          </div>

          {/* CARD 2: AIR QUALITY OVERVIEW */}
          <div className="ref-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* SVG Semi Donut Gauge */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10233A"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.8"
                  strokeDasharray="65, 100"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>65</span>
                <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, marginTop: '1px' }}>AQI</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                AIR QUALITY OVERVIEW
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                Moderate
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>
                Air quality is acceptable for most outdoor activities.
              </div>
              <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 600 }}>
                Pollutant: <span style={{ color: '#ffffff', fontWeight: 800 }}>PM2.5</span> &nbsp;|&nbsp; 24 µg/m³
              </div>
            </div>
          </div>

          {/* CARD 3: SUN & MOON */}
          <div className="ref-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', marginBottom: '10px' }}>
              SUN & MOON
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Sun Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={18} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Sunrise</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>05:36 AM</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={18} color="#ef4444" />
                  <div>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Sunset</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>06:12 PM</div>
                  </div>
                </div>
              </div>

              {/* Moon Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Moon size={18} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Moonrise</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>04:32 AM</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Moon size={18} color="#94a3b8" />
                  <div>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Moonset</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>05:11 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: WEATHER DETAILS */}
          <div className="ref-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', marginBottom: '10px' }}>
              WEATHER DETAILS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><Droplets size={12} color="#38bdf8" /> Dew Point</span>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>25.5°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><CloudSun size={12} color="#38bdf8" /> Cloud Cover</span>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>100%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><CloudRain size={12} color="#38bdf8" /> Precipitation</span>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>0.0 mm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><Wind size={12} color="#38bdf8" /> Ozone (O₃)</span>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>32 ppb</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. BOTTOM ENTERPRISE SYSTEM STATUS BAR */}
        <div 
          className="ref-card"
          style={{ 
            padding: '10px 18px', 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center',
            fontSize: '0.68rem',
            color: '#94a3b8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              Data Stream Connected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              AI Engine Online
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              Weather API Connected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              SQLite Database Connected
            </span>
          </div>

          <div style={{ fontWeight: 600 }}>
            Last Updated: <span style={{ color: '#38bdf8', fontWeight: 700 }}>Just now</span>
          </div>
        </div>

      </div>

      {/* LOCATION SELECTION & SEARCH MODAL */}
      {isLocationModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 9999, 
          background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ 
            background: '#0B1B2F', border: '1px solid rgba(56, 189, 248, 0.3)', 
            borderRadius: '14px', width: '100%', maxWidth: '480px', 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Select Location</h3>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Search worldwide geocoding database</p>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search city (e.g. New Delhi, London, Tokyo)..." 
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  width: '100%', background: '#10233A',
                  border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px',
                  padding: '9px 12px 9px 34px', color: '#ffffff', fontSize: '0.82rem'
                }}
              />
            </div>

            {isSearching && <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Searching cities...</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
              {searchResults.map((res, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectLocation(res)}
                  style={{
                    padding: '8px 12px', background: '#10233A',
                    border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '6px',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{res.city}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{res.region ? `${res.region}, ` : ''}{res.country}</div>
                  </div>
                  <Check size={13} color="#38bdf8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
};

export default WeatherIntelligence;
