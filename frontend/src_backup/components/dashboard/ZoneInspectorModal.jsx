import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  MapPin, 
  Wind, 
  Car, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Radio, 
  Maximize2,
  Minimize2,
  Volume2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function ZoneInspectorModal({ zone = null, onClose = () => {} }) {
  if (!zone) return null;

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const zoneName = zone.name || "Bhubaneswar Zone";
  const lat = zone.lat || 20.2961;
  const lng = zone.lng || 85.8245;
  const speed = zone.speed || 28;
  const aqi = zone.aqi || 72;
  const risk = zone.risk || "Low Risk";
  const health = zone.health || 84;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '920px',
          background: 'rgba(11, 15, 23, 0.98)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(6, 182, 212, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* MODAL HEADER */}
        <div 
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), transparent)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Video size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                  {zoneName} — Street-Level Digital Twin
                </h3>
                <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  ● LIVE CCTV FEED
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                GPS: {lat}° N, {lng}° E • Bhubaneswar Smart City Network
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }}>
          
          {/* LEFT: SIMULATED CCTV STREET FEED */}
          <div 
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#04070d',
              border: '1px solid rgba(255,255,255,0.1)',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Camera Feed Background Simulation */}
            <img 
              src="/bhubaneswar_3d_twin.jpg" 
              alt="Street Feed" 
              style={{
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                filter: 'brightness(0.7) contrast(1.2) hue-rotate(10deg)'
              }}
            />

            {/* Camera Grid Overlay */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none'
              }}
            />

            {/* AI Bounding Box Overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '35%',
                left: '40%',
                width: '120px',
                height: '80px',
                border: '1.5px stroke #38bdf8',
                borderStyle: 'dashed',
                borderRadius: '4px',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                pointerEvents: 'none'
              }}
            >
              <div style={{ position: 'absolute', top: '-18px', left: 0, background: '#38bdf8', color: '#000', fontSize: '0.60rem', fontWeight: 900, padding: '1px 4px', borderRadius: '2px' }}>
                VEHICLE FLEET [CONFIDENCE 98%]
              </div>
            </div>

            {/* Camera Details Overlay */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'monospace' }}>
              CAM-BBSR-{zoneName.toUpperCase().replace(/\s+/g, '')}-01
            </div>

            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(244, 63, 94, 0.8)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
              <span>REC {currentTime}</span>
            </div>

            <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(11, 15, 23, 0.9)', backdropFilter: 'blur(8px)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
              <div>Signal Status: <span style={{ color: '#34d399', fontWeight: 700 }}>● OPTIMIZED</span></div>
              <div>Camera Speed: <span style={{ color: '#f8fafc', fontWeight: 700 }}>60 FPS</span></div>
            </div>
          </div>

          {/* RIGHT: ZONE TELEMETRY & AI ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Zone Telemetry Card */}
            <div style={{ background: 'rgba(18, 26, 38, 0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Zone Environment & Mobility Metrics
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Urban Speed</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: speed >= 25 ? '#34d399' : '#fb7185', marginTop: '2px' }}>
                    {speed} km/h
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Air Quality</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: aqi < 75 ? '#34d399' : '#fbbf24', marginTop: '2px' }}>
                    {aqi} AQI
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Health Score</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                    {health} / 100
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Risk Level</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: risk.includes('High') ? '#fb7185' : '#34d399', marginTop: '2px' }}>
                    {risk}
                  </div>
                </div>
              </div>
            </div>

            {/* Active IoT Sensors */}
            <div style={{ background: 'rgba(18, 26, 38, 0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="#06b6d4" />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>Active IoT Sensors</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>12 Nodes • 99.4% Uptime</div>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                ONLINE
              </span>
            </div>

            {/* AI Autonomous Recommendation */}
            <div style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(6, 182, 212, 0.2))', padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Sparkles size={16} color="#38bdf8" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8' }}>AI Action Recommendation</div>
                <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.4 }}>
                  Traffic flow optimized. Green light wave active for emergency corridors along {zoneName}.
                </div>
              </div>
            </div>

            {/* Close / Return Button */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              Zoom Out to City Overview
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
