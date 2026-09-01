import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { 
  CloudSun, Thermometer, Droplets, Wind, ShieldAlert, 
  MapPin, RefreshCw, Compass, Plus, Minus, Layers, 
  Sun, Zap, Search, X, Check
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import weatherService from '../services/weatherService';

export const WeatherIntelligence = () => {
  // 1. Core State
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // User Location State
  const [userLocation, setUserLocation] = useState({
    city: 'Bhubaneswar',
    region: 'Odisha',
    country: 'India',
    lat: 20.2961,
    lng: 85.8245
  });

  // Weather & Radar State
  const [weatherData, setWeatherData] = useState(null);
  const [radarStatus, setRadarStatus] = useState('LOADING'); // 'LOADING' | 'SUCCESS' | 'FAILURE'
  const [radarMeta, setRadarMeta] = useState(null);
  const [mapStyle, setMapStyle] = useState('terrain'); // 'terrain' | 'satellite' | 'dark'

  // Search & Modal State
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

  // Map Tile Endpoints (Watermark-Free, High Performance)
  const BASEMAP_TILES = {
    terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
  };

  // 2. Fetch Weather Data for Location
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

  // 3. Fetch RainViewer Doppler Radar Metadata
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

  // 4. Initial Location Detection & Telemetry Loading
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
        () => {
          loadWeatherData(userLocation);
        },
        { timeout: 6000 }
      );
    } else {
      loadWeatherData(userLocation);
    }
    loadRadarData();
  }, []);

  // 5. Initialize Leaflet Radar Map
  useEffect(() => {
    if (loading || !radarMapContainerRef.current) return;

    if (!radarMapInstanceRef.current) {
      const map = L.map(radarMapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Default Basemap Layer
      const baseLayer = L.tileLayer(BASEMAP_TILES[mapStyle] || BASEMAP_TILES.terrain, {
        maxZoom: 16,
        attribution: 'Esri, HERE, Garmin, © OpenStreetMap'
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

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } else {
      radarMapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 7);
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        const popupHtml = `
          <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; font-weight: 700; padding: 2px 4px;">
            <div style="color: #0284c7; font-size: 13px; font-weight: 800;">📍 ${userLocation.city}</div>
            <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${userLocation.lat.toFixed(2)}°N, ${userLocation.lng.toFixed(2)}°E</div>
            <div style="color: #10b981; font-size: 10px; margin-top: 4px; font-weight: 800;">● Doppler Telemetry Active</div>
          </div>
        `;
        locationMarkerRef.current.setPopupContent(popupHtml);
      }
      setTimeout(() => {
        radarMapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [loading, userLocation.lat, userLocation.lng]);

  // 6. Dynamic Basemap Layer Switcher Effect
  useEffect(() => {
    const map = radarMapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const newBaseLayer = L.tileLayer(BASEMAP_TILES[mapStyle] || BASEMAP_TILES.terrain, {
      maxZoom: 16,
      attribution: 'Esri, HERE, Garmin, © OpenStreetMap'
    });
    newBaseLayer.addTo(map);
    baseTileLayerRef.current = newBaseLayer;

    // Keep radar layer on top if available
    if (radarTileLayerRef.current) {
      radarTileLayerRef.current.bringToFront();
    }
  }, [mapStyle]);

  // 6. Synchronize Radar Tile Overlay
  useEffect(() => {
    const map = radarMapInstanceRef.current;
    if (!map) return;

    if (radarTileLayerRef.current) {
      map.removeLayer(radarTileLayerRef.current);
      radarTileLayerRef.current = null;
    }

    if (radarStatus === 'SUCCESS' && radarMeta && radarMeta.tileUrlTemplate) {
      const radarLayer = L.tileLayer(radarMeta.tileUrlTemplate, {
        opacity: 0.68,
        tileSize: 256,
        minZoom: 0,
        maxNativeZoom: 7, // RainViewer free ceiling. Upscales cleanly up to 18 without API errors.
        maxZoom: 18
      });

      radarLayer.addTo(map);
      radarTileLayerRef.current = radarLayer;
    }
  }, [radarStatus, radarMeta]);

  // Map Controls
  const handleMapZoomIn = () => radarMapInstanceRef.current?.zoomIn();
  const handleMapZoomOut = () => radarMapInstanceRef.current?.zoomOut();
  const handleMapRecenter = () => radarMapInstanceRef.current?.setView([userLocation.lat, userLocation.lng], 7);

  // Manual Unified Refresh
  const handleRefreshAll = () => {
    loadWeatherData(userLocation, true);
    loadRadarData();
  };

  // Location Search Handler
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

  // Select Location Handler
  const handleSelectLocation = (loc) => {
    const newLoc = {
      city: loc.city,
      region: loc.region,
      country: loc.country,
      lat: loc.lat,
      lng: loc.lng
    };
    setUserLocation(newLoc);
    setIsLocationModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    loadWeatherData(newLoc);
  };

  // Temperature Formatter
  const formatTemp = (celsius, includeSymbol = true) => {
    if (celsius === undefined || celsius === null) return '--';
    let val = celsius;
    if (unit === 'F') {
      val = Math.round((celsius * 9) / 5 + 32);
    }
    return includeSymbol ? `${val}°` : `${val}`;
  };

  // Weather Icon Renderer
  const renderWeatherIcon = (iconType, size = 26) => {
    switch (iconType) {
      case 'sun':
        return <Sun size={size} color="#f59e0b" />;
      case 'sun-cloud':
        return <CloudSun size={size} color="#38bdf8" />;
      case 'cloud':
        return <CloudSun size={size} color="#94a3b8" />;
      case 'cloud-fog':
        return <CloudSun size={size} color="#a855f7" />;
      case 'rain':
        return <Droplets size={size} color="#06b6d4" />;
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
    <PageContainer
      title="WEATHER INTELLIGENCE & METEOROLOGICAL IMPACT"
      subtitle="Real-time atmospheric conditions, temperature vectors & urban impact correlation"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 1. TOP HEADER LOCATION BAR */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
          
          {/* Location Badge & Change Button */}
          <div style={{ 
            background: 'rgba(11, 15, 23, 0.88)', 
            border: '1px solid rgba(255, 255, 255, 0.12)', 
            borderRadius: '10px', 
            padding: '6px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px',
            backdropFilter: 'blur(10px)'
          }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CURRENT LOCATION
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', marginTop: '1px' }}>
                {userLocation.city}{userLocation.region ? `, ${userLocation.region}` : ''}, {userLocation.country}
              </div>
            </div>

            <button
              data-testid="change-location-btn"
              onClick={() => setIsLocationModalOpen(true)}
              style={{
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '6px',
                color: '#38bdf8',
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MapPin size={13} />
              <span>Change Location</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            data-testid="refresh-weather-btn"
            onClick={handleRefreshAll}
            disabled={isRefreshing || loading}
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              color: '#ffffff',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
            title="Refresh Telemetry"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} color="#38bdf8" />
          </button>

        </div>

        {/* 2. UPPER MAIN 3-COLUMN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1.65fr 1.2fr', gap: '16px' }}>

          {/* COLUMN 1: CURRENT WEATHER CARD */}
          <div 
            style={{ 
              borderRadius: '14px', 
              overflow: 'hidden', 
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(7, 11, 18, 0.95) 100%), url("https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80")', 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(255,255,255,0.12)', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              position: 'relative'
            }}
          >
            <div style={{ padding: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>
                  CURRENT WEATHER
                </span>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.25)', 
                  border: '1px solid rgba(16, 185, 129, 0.5)', 
                  color: '#34d399', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.65rem', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
                  Live
                </span>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '3.4rem', fontWeight: 900, color: '#ffffff', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                  {formatTemp(cur.tempC, false)}°C
                </div>
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '6px', fontWeight: 600 }}>
                  Feels like {formatTemp(cur.feelsC, false)}°
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                  {renderWeatherIcon(cur.icon, 28)}
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {cur.condition || 'Partly Cloudy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div style={{ 
              background: 'rgba(7, 11, 18, 0.92)', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              padding: '12px 16px', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '6px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              backdropFilter: 'blur(8px)'
            }}>
              <div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>Wind</div>
                <div style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
                  {cur.windKmh || 14} km/h {cur.windDir || 'SW'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>Humidity</div>
                <div style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
                  {cur.humidity || 58.2}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>Pressure</div>
                <div style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
                  {cur.pressure || 1007} hPa
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>Visibility</div>
                <div style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
                  {cur.visibility || 10} km
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: 4 METRIC CARDS & PRIMARY CONDITION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Top 4 Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              
              {/* HUMIDITY */}
              <div style={{ background: 'rgba(11, 15, 23, 0.88)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>RELATIVE HUMIDITY</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                  {cur.humidity || 58.2}%
                </div>
                <div style={{ fontSize: '0.62rem', color: '#38bdf8', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }} />
                  Optimal
                </div>
              </div>

              {/* RISK */}
              <div style={{ background: 'rgba(11, 15, 23, 0.88)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>WEATHER RISK RATING</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: riskObj.color, marginTop: '6px' }}>
                  {riskObj.rating}
                </div>
                <div style={{ fontSize: '0.62rem', color: riskObj.color, marginTop: '4px', fontWeight: 600 }}>
                  {riskObj.desc}
                </div>
              </div>

              {/* AQI */}
              <div style={{ background: 'rgba(11, 15, 23, 0.88)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>AIR QUALITY (AQI)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                  {aqiObj.value || 58}
                </div>
                <div style={{ fontSize: '0.62rem', color: aqiObj.category?.color || '#f59e0b', marginTop: '4px', fontWeight: 600 }}>
                  {aqiObj.category?.label || 'Moderate'}
                </div>
              </div>

              {/* UV */}
              <div style={{ background: 'rgba(11, 15, 23, 0.88)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>UV INDEX</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                  {uvObj.value ?? 2}
                </div>
                <div style={{ fontSize: '0.62rem', color: uvObj.category?.color || '#a855f7', marginTop: '4px', fontWeight: 600 }}>
                  {uvObj.category?.label || 'Low'}
                </div>
              </div>

            </div>

            {/* Primary Condition Card with Sunset Clouds Landscape Image */}
            <div 
              style={{ 
                flex: 1, 
                borderRadius: '12px', 
                overflow: 'hidden',
                background: 'linear-gradient(90deg, rgba(7, 11, 18, 0.95) 0%, rgba(7, 11, 18, 0.6) 55%, transparent 100%), url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center right',
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
                  PRIMARY CONDITION
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '6px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {cur.condition || 'Partly Cloudy'}
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                Wind: {cur.windKmh || 14} km/h {cur.windDir || 'SW'} &bull; Gust: {cur.windGust || 22} km/h
              </div>
            </div>

          </div>

          {/* COLUMN 3: LIVE WEATHER RADAR MAP */}
          <div 
            style={{ 
              borderRadius: '14px', 
              overflow: 'hidden', 
              background: '#070b12', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
              background: 'linear-gradient(180deg, rgba(7,11,18,0.92) 0%, rgba(7,11,18,0) 100%)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>
                LIVE WEATHER RADAR
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Map Style Pills */}
                <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <button 
                    onClick={() => setMapStyle('terrain')} 
                    style={{ 
                      background: mapStyle === 'terrain' ? '#0284c7' : 'none', 
                      color: mapStyle === 'terrain' ? '#ffffff' : '#94a3b8', 
                      border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer' 
                    }}
                    title="Vibrant Street & Terrain Map (Default)"
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
                    title="Real Aerial Satellite Imagery"
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
                    title="Dark Slate GIS Map"
                  >
                    Dark
                  </button>
                </div>

                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.25)', 
                  border: '1px solid rgba(16, 185, 129, 0.4)', 
                  color: '#34d399', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.64rem', 
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
                  Live
                </span>
              </div>
            </div>

            {/* Floating Map Controls */}
            <div style={{ 
              position: 'absolute', top: '44px', right: '10px', zIndex: 10, 
              display: 'flex', flexDirection: 'column', gap: '4px',
              background: 'rgba(7, 11, 18, 0.88)', padding: '4px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)'
            }}>
              <button 
                onClick={() => setMapStyle(prev => prev === 'terrain' ? 'satellite' : prev === 'satellite' ? 'dark' : 'terrain')} 
                style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }} 
                title={`Cycle Basemap Layer (Current: ${mapStyle.toUpperCase()})`}
              >
                <Layers size={14} color="#38bdf8" />
              </button>
              <button onClick={handleMapRecenter} style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }} title="Recenter"><Compass size={14} /></button>
              <button onClick={handleMapZoomIn} style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }} title="Zoom In"><Plus size={14} /></button>
              <button onClick={handleMapZoomOut} style={{ background: 'none', border: 'none', color: '#ffffff', padding: '4px', cursor: 'pointer' }} title="Zoom Out"><Minus size={14} /></button>
            </div>

            {/* Leaflet Map Container */}
            <div ref={radarMapContainerRef} style={{ width: '100%', height: '100%', minHeight: '230px', flex: 1, zIndex: 1 }} />

            {/* Radar Legend Bar */}
            <div style={{ position: 'relative', zIndex: 10, background: '#070b12', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px' }}>
              <div style={{ height: '5px', borderRadius: '3px', background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 35%, #f59e0b 70%, #a855f7 100%)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>
                <span>Light</span>
                <span>Moderate</span>
                <span>Heavy</span>
                <span style={{ color: '#a855f7' }}>Very Heavy</span>
              </div>
            </div>

          </div>

        </div>

        {/* 3. LOWER FORECAST ROWS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '16px' }}>
          
          {/* HOURLY FORECAST (10 Vertical Cards) */}
          <div style={{ padding: '16px', background: 'rgba(11, 15, 23, 0.88)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                HOURLY FORECAST
              </span>

              {/* Unit Switcher Button [ °C | °F ] inside Hourly Forecast Header */}
              <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <button 
                  onClick={() => setUnit('C')} 
                  style={{ 
                    background: unit === 'C' ? '#0284c7' : 'none', 
                    color: unit === 'C' ? '#ffffff' : '#94a3b8', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '2px 8px', 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  °C
                </button>
                <button 
                  onClick={() => setUnit('F')} 
                  style={{ 
                    background: unit === 'F' ? '#0284c7' : 'none', 
                    color: unit === 'F' ? '#ffffff' : '#94a3b8', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '2px 8px', 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  °F
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px' }}>
              {weatherData?.hourly?.slice(0, 10).map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: idx === 0 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)', 
                    border: idx === 0 ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255,255,255,0.05)', 
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
                    {renderWeatherIcon(item.icon, 20)}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
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
          <div style={{ padding: '16px', background: 'rgba(11, 15, 23, 0.88)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                7-DAY FORECAST
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {weatherData?.sevenDay?.map((day, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: idx === 0 ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '10px', 
                    padding: '10px 2px', 
                    textAlign: 'center' 
                  }}
                >
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: idx === 0 ? '#38bdf8' : '#94a3b8' }}>
                    {day.day}
                  </div>
                  <div style={{ margin: '6px 0' }}>
                    {renderWeatherIcon(day.condition, 18)}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>
                    {formatTemp(day.high, false)}°
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>
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

      </div>

      {/* LOCATION SELECTION & SEARCH MODAL */}
      {isLocationModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 9999, 
          background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ 
            background: '#0d131c', border: '1px solid rgba(56, 189, 248, 0.3)', 
            borderRadius: '16px', width: '100%', maxWidth: '500px', 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Select Location</h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Search worldwide geocoding database</p>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search city (e.g. New Delhi, London, Tokyo)..." 
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  width: '100%', background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px',
                  padding: '10px 12px 10px 36px', color: '#ffffff', fontSize: '0.85rem'
                }}
              />
            </div>

            {isSearching && <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Searching cities...</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {searchResults.map((res, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectLocation(res)}
                  style={{
                    padding: '10px 12px', background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{res.city}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{res.region ? `${res.region}, ` : ''}{res.country}</div>
                  </div>
                  <Check size={14} color="#38bdf8" />
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
