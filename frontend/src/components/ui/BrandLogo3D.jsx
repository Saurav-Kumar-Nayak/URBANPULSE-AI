import React from 'react';
import { Activity } from 'lucide-react';

/**
 * 3D Brand Logo Component matching UrbanPulse AI reference image
 * Props:
 * - size: 'sm' | 'md' | 'lg'
 * - showSubtitle: boolean
 * - showPulseLine: boolean
 * - onClick: function
 */
export const BrandLogo3D = ({ 
  size = 'md', 
  showSubtitle = true, 
  showPulseLine = false,
  onClick 
}) => {
  // Size presets
  const sizeMap = {
    sm: {
      badgeSize: 32,
      iconSize: 18,
      titleSize: '1.05rem',
      subSize: '0.55rem',
      gap: '8px',
      subGap: '1px'
    },
    md: {
      badgeSize: 42,
      iconSize: 22,
      titleSize: '1.35rem',
      subSize: '0.62rem',
      gap: '12px',
      subGap: '2px'
    },
    lg: {
      badgeSize: 72,
      iconSize: 38,
      titleSize: '2.4rem',
      subSize: '0.85rem',
      gap: '18px',
      subGap: '6px'
    }
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'inline-flex', 
        flexDirection: 'column', 
        alignItems: showPulseLine && size === 'lg' ? 'center' : 'flex-start',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: current.gap }}>
        
        {/* 3D EMBOSSED SQUIRCLE BADGE WITH BEVEL & INNER SHADOW */}
        <div 
          style={{ 
            width: `${current.badgeSize}px`, 
            height: `${current.badgeSize}px`, 
            borderRadius: `${Math.round(current.badgeSize * 0.28)}px`, 
            background: 'linear-gradient(145deg, #2563eb 0%, #0284c7 50%, #0369a1 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.45), inset 0 2px 3px rgba(255, 255, 255, 0.5), inset 0 -3px 5px rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            position: 'relative',
            flexShrink: 0,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Waveform Icon with 3D Drop Shadow */}
          <Activity 
            size={current.iconSize} 
            color="#ffffff" 
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6)) stroke-width: 2.5',
              strokeWidth: 2.6
            }} 
          />
        </div>

        {/* 3D TYPOGRAPHY & SUBTITLE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: current.subGap }}>
          
          {/* Main Title 3D Text */}
          <div 
            style={{ 
              fontSize: current.titleSize, 
              fontWeight: 900, 
              letterSpacing: '-0.02em', 
              lineHeight: 1.0,
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            {/* White 3D Extruded Text */}
            <span 
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 0 #cbd5e1, 0 2px 0 #94a3b8, 0 3px 0 #64748b, 0 4px 10px rgba(0,0,0,0.8)'
              }}
            >
              UrbanPulse
            </span>

            {/* Vibrant Sky-Blue 3D Extruded Text */}
            <span 
              style={{ 
                color: '#38bdf8',
                textShadow: '0 1px 0 #0284c7, 0 2px 0 #0369a1, 0 4px 12px rgba(56, 189, 248, 0.7)'
              }}
            >
              AI
            </span>
          </div>

          {/* Subtitle */}
          {showSubtitle && (
            <div 
              style={{ 
                fontSize: current.subSize, 
                color: '#38bdf8', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                fontWeight: 800,
                textShadow: '0 0 8px rgba(56, 189, 248, 0.45)',
                whiteSpace: 'nowrap'
              }}
            >
              SMART CITY INTELLIGENCE PLATFORM
            </div>
          )}

        </div>

      </div>

      {/* 3D GLOWING PULSE UNDERLINE WAVE (EXACT MATCH FOR REFERENCE IMAGE) */}
      {showPulseLine && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            width: '100%', 
            marginTop: '12px',
            opacity: 0.95 
          }}
        >
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #38bdf8)', boxShadow: '0 0 8px #38bdf8' }} />
          <Activity size={18} color="#38bdf8" style={{ filter: 'drop-shadow(0 0 8px #38bdf8)', strokeWidth: 2.8 }} />
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, #38bdf8, transparent)', boxShadow: '0 0 8px #38bdf8' }} />
        </div>
      )}

    </div>
  );
};

export default BrandLogo3D;
