import React, { useState, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, ArrowRight, AlertTriangle, 
  RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Activity
} from 'lucide-react';

/**
 * Enterprise 3D UrbanMetricCard
 * Outer Shell: Layered 3D glassmorphism with dynamic mouse tilt parallax
 * Inner Content: Standardized typography hierarchy, status badges, trend indicators,
 * embedded mini visualizations (sparklines, mini bar, radial progress), and CTA actions.
 */
export default function UrbanMetricCard({
  title,
  category = 'ANALYTICS',
  value,
  unit = '',
  previousValue = null,
  description = '',
  trend = null,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  status = null, // e.g., 'Optimal', 'Critical', 'Moderate', 'Needs Attention', 'Healthy'
  statusType = 'info', // 'healthy' | 'optimal' | 'warning' | 'critical' | 'info' | 'violet'
  icon: Icon = Activity,
  iconColor = '#20D9FF',
  chartType = 'sparkline', // 'sparkline' | 'bar' | 'radial' | 'trend' | 'none'
  chartData = [20, 35, 25, 45, 30, 60, 50, 75, 65, 90],
  onClick = null,
  actionLabel = 'Explore Details',
  loading = false,
  error = null,
  onRetry = null,
  empty = false,
  emptyMessage = 'No telemetry available',
  disabled = false,
  active = false,
  variant = 'default', // 'default' | 'glass' | 'highlight'
  className = '',
  style = {}
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth 3D Mouse Parallax Tilt Tracker
  const handleMouseMove = (e) => {
    if (disabled || loading || error || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized position -1 to 1
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    // Restrained, realistic tilt (max 8 degrees)
    const rotateY = xPct * 7;
    const rotateX = -yPct * 7;

    setTilt({
      x: rotateX,
      y: rotateY,
      sheenX: (mouseX / width) * 100,
      sheenY: (mouseY / height) * 100
    });
  };

  const handleMouseEnter = () => {
    if (!disabled && !loading && !error) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  };

  // Status Styling Dictionary
  const statusStyles = {
    healthy: { bg: 'rgba(39, 209, 127, 0.12)', color: '#27D17F', border: 'rgba(39, 209, 127, 0.35)', dot: '#27D17F' },
    optimal: { bg: 'rgba(32, 217, 255, 0.12)', color: '#20D9FF', border: 'rgba(32, 217, 255, 0.35)', dot: '#20D9FF' },
    warning: { bg: 'rgba(255, 176, 32, 0.12)', color: '#FFB020', border: 'rgba(255, 176, 32, 0.35)', dot: '#FFB020' },
    critical: { bg: 'rgba(255, 90, 103, 0.14)', color: '#FF5A67', border: 'rgba(255, 90, 103, 0.4)', dot: '#FF5A67' },
    violet: { bg: 'rgba(157, 100, 255, 0.14)', color: '#9D64FF', border: 'rgba(157, 100, 255, 0.35)', dot: '#9D64FF' },
    info: { bg: 'rgba(120, 170, 255, 0.12)', color: '#78AAFF', border: 'rgba(120, 170, 255, 0.3)', dot: '#78AAFF' }
  };

  const currentStatusStyle = statusStyles[statusType] || statusStyles.info;

  // Render Mini Sparkline Graph
  const renderSparkline = () => {
    if (!chartData || chartData.length < 2) return null;
    const maxVal = Math.max(...chartData, 1);
    const minVal = Math.min(...chartData, 0);
    const range = maxVal - minVal || 1;
    const svgWidth = 100;
    const svgHeight = 34;

    const points = chartData.map((val, idx) => {
      const x = (idx / (chartData.length - 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / range) * (svgHeight - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const areaPoints = `0,${svgHeight} ${points} ${svgWidth},${svgHeight}`;

    return (
      <svg width="100" height="34" viewBox="0 0 100 34" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${title?.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={iconColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={iconColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${title?.replace(/\s+/g, '-')})`} />
        <polyline
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Animated End Node */}
        {chartData.length > 0 && (() => {
          const lastVal = chartData[chartData.length - 1];
          const lastX = svgWidth;
          const lastY = svgHeight - ((lastVal - minVal) / range) * (svgHeight - 6) - 3;
          return (
            <circle
              cx={lastX}
              cy={lastY}
              r="3"
              fill={iconColor}
              stroke="#0B1730"
              strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 6px ${iconColor})` }}
            />
          );
        })()}
      </svg>
    );
  };

  // Render Mini Bar Visualization
  const renderMiniBars = () => {
    if (!chartData || chartData.length === 0) return null;
    const maxVal = Math.max(...chartData, 1);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '30px' }}>
        {chartData.slice(-8).map((val, i) => {
          const heightPct = Math.max(15, (val / maxVal) * 100);
          const isHighest = val === maxVal;
          return (
            <div
              key={i}
              style={{
                width: '6px',
                height: `${heightPct}%`,
                background: isHighest ? iconColor : 'rgba(120, 170, 255, 0.25)',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                boxShadow: isHighest ? `0 0 8px ${iconColor}` : 'none'
              }}
            />
          );
        })}
      </div>
    );
  };

  // Render Radial Circular Progress
  const renderRadialProgress = () => {
    const rawVal = parseFloat(value) || 68;
    const clampedPct = Math.min(100, Math.max(0, rawVal));
    const radius = 14;
    const strokeWidth = 3;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="rgba(120, 170, 255, 0.15)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={iconColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
        <span style={{ position: 'absolute', fontSize: '0.62rem', fontWeight: 800, color: '#F5F8FF' }}>
          {Math.round(clampedPct)}%
        </span>
      </div>
    );
  };

  // 1. LOADING STATE
  if (loading) {
    return (
      <div
        className="urban-3d-card-shell"
        style={{
          background: '#0B1730',
          border: '1px solid rgba(120, 170, 255, 0.14)',
          minHeight: '190px',
          padding: '20px',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          ...style
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '38px', height: '38px', borderRadius: '10px' }} />
          <div className="skeleton" style={{ width: '70px', height: '20px', borderRadius: '12px' }} />
        </div>
        <div style={{ margin: '14px 0' }}>
          <div className="skeleton" style={{ width: '110px', height: '14px', borderRadius: '4px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '150px', height: '28px', borderRadius: '6px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div
        className="urban-3d-card-shell"
        style={{
          background: 'linear-gradient(145deg, rgba(26, 12, 22, 0.95) 0%, rgba(12, 7, 16, 0.98) 100%)',
          border: '1px solid rgba(255, 90, 103, 0.4)',
          minHeight: '190px',
          padding: '20px',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          boxShadow: '0 12px 30px rgba(255, 90, 103, 0.15)',
          ...style
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={20} color="#FF5A67" />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FF5A67', textTransform: 'uppercase' }}>
            Telemetry Telecommunications Failure
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#91A4C5', margin: '10px 0' }}>
          {typeof error === 'string' ? error : 'Unable to connect to sensor pipeline.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: 'rgba(255, 90, 103, 0.15)',
              border: '1px solid rgba(255, 90, 103, 0.4)',
              color: '#FF5A67',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: 'fit-content'
            }}
          >
            <RefreshCw size={12} />
            <span>Retry Telemetry Link</span>
          </button>
        )}
      </div>
    );
  }

  // 3. EMPTY STATE
  if (empty) {
    return (
      <div
        className="urban-3d-card-shell"
        style={{
          background: '#0B1730',
          border: '1px dashed rgba(120, 170, 255, 0.25)',
          minHeight: '190px',
          padding: '20px',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          textAlign: 'center',
          ...style
        }}
      >
        <Sparkles size={24} color="#78AAFF" style={{ opacity: 0.6, marginBottom: '8px' }} />
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F5F8FF' }}>No Data Signal</span>
        <span style={{ fontSize: '0.72rem', color: '#91A4C5', marginTop: '4px' }}>{emptyMessage}</span>
      </div>
    );
  }

  // 4. NORMAL ACTIVE / HOVER STATE
  const dynamicTransform = isHovered
    ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-6px)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';

  return (
    <div
      ref={cardRef}
      className={`urban-3d-card-shell ${active ? 'active-card' : ''} ${disabled ? 'disabled-card' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled && onClick ? onClick : undefined}
      style={{
        transform: dynamicTransform,
        opacity: disabled ? 0.55 : 1,
        cursor: onClick && !disabled ? 'pointer' : 'default',
        border: active ? `1.5px solid ${iconColor}` : '1px solid rgba(120, 170, 255, 0.16)',
        boxShadow: active
          ? `0 20px 45px rgba(0, 0, 0, 0.85), 0 0 30px ${iconColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.25)`
          : undefined,
        ...style
      }}
    >
      {/* Dynamic Specular Glass Reflection Layer */}
      <div
        className="urban-card-reflection"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`
            : 'radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 55%)'
        }}
      />

      {/* TOP HEADER: ICON CONTAINER + CATEGORY + STATUS BADGE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="urban-3d-layer-float-mid">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: `radial-gradient(circle at 30% 30%, ${iconColor}25 0%, rgba(11, 23, 48, 0.8) 100%)`,
              border: `1px solid ${iconColor}45`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 6px 14px ${iconColor}20, inset 0 1px 0 rgba(255, 255, 255, 0.3)`
            }}
          >
            <Icon size={20} color={iconColor} />
          </div>

          <div>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#91A4C5', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {category}
            </span>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#F5F8FF', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {title}
            </h4>
          </div>
        </div>

        {/* Meaningful Status Badge */}
        {status && (
          <div
            className="urban-3d-layer-float-low"
            style={{
              background: currentStatusStyle.bg,
              border: `1px solid ${currentStatusStyle.border}`,
              color: currentStatusStyle.color,
              padding: '3px 9px',
              borderRadius: '10px',
              fontSize: '0.66rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              letterSpacing: '0.02em',
              boxShadow: `0 2px 8px ${currentStatusStyle.border}30`
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentStatusStyle.dot, boxShadow: `0 0 6px ${currentStatusStyle.dot}` }} />
            <span>{status}</span>
          </div>
        )}
      </div>

      {/* MIDDLE: MAIN METRIC VALUE + CONTEXTUAL DESCRIPTION */}
      <div style={{ margin: '14px 0 10px 0', position: 'relative', zIndex: 2 }} className="urban-3d-layer-float-high">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span
            style={{
              fontSize: '1.95rem',
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              color: '#F5F8FF',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}
          >
            {value}
          </span>
          {unit && (
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#91A4C5' }}>
              {unit}
            </span>
          )}
        </div>

        {(description || previousValue) && (
          <div style={{ fontSize: '0.72rem', color: '#91A4C5', marginTop: '5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {description && <span>{description}</span>}
            {previousValue && (
              <span style={{ color: '#64748B', borderLeft: '1px solid rgba(120,170,255,0.2)', paddingLeft: '6px' }}>
                Prev: {previousValue}
              </span>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM: TREND INDICATOR + MINI DATA VISUALIZATION + ACTION */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          borderTop: '1px solid rgba(120, 170, 255, 0.1)',
          paddingTop: '10px',
          marginTop: '6px',
          position: 'relative',
          zIndex: 2
        }}
        className="urban-3d-layer-float-mid"
      >
        {/* Trend Direction Delta */}
        {trend && (
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: trendDirection === 'up' ? '#27D17F' : (trendDirection === 'down' ? '#FF5A67' : '#91A4C5')
            }}
          >
            {trendDirection === 'up' && <TrendingUp size={14} />}
            {trendDirection === 'down' && <TrendingDown size={14} />}
            {trendDirection === 'neutral' && <Minus size={14} />}
            <span>{trend}</span>
          </div>
        )}

        {/* Embedded Mini Graph Visualization */}
        {chartType === 'sparkline' && renderSparkline()}
        {chartType === 'bar' && renderMiniBars()}
        {chartType === 'radial' && renderRadialProgress()}

        {/* Action Button CTA */}
        {onClick && (
          <div
            style={{
              fontSize: '0.70rem',
              fontWeight: 800,
              color: isHovered ? iconColor : '#91A4C5',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color 0.2s ease',
              marginLeft: 'auto'
            }}
          >
            <span>{actionLabel}</span>
            <ArrowRight size={12} style={{ transform: isHovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s ease' }} />
          </div>
        )}
      </div>
    </div>
  );
}
