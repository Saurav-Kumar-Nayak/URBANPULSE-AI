import React from 'react';
import { Users, Building2, MapPin, Database, AlertTriangle, ArrowRight } from 'lucide-react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';

export default function KpiCards({ overview = null, activeZone = null, kpis = [], loading = false }) {
  const { setActiveTab } = useUrbanPulseContext();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: '76px', borderRadius: '12px' }} />
        ))}
      </div>
    );
  }

  // Zone specific metrics or default city metrics
  const popVal = activeZone?.population || '968K';
  const areaVal = activeZone?.areaSqKm ? `${activeZone.areaSqKm} sq km` : '176 sq km';
  const zonesVal = activeZone?.sensorNodes ? `${activeZone.sensorNodes}` : '52';
  const sourcesVal = activeZone?.dataSources ? `${activeZone.dataSources}` : '128+';
  const activeAlertsVal = activeZone?.alertsCount !== undefined ? `${activeZone.alertsCount}` : '3 Active';
  const anomalyCountText = overview?.anomaly_count ? `(${overview.anomaly_count} Anomalies Logged)` : '(25 Anomalies Logged)';

  const cards = [
    {
      id: 'population',
      title: 'Population',
      value: popVal,
      trend: '↑ 2.3%',
      icon: Users,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'area',
      title: 'Area',
      value: areaVal,
      icon: Building2,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'zones',
      title: 'Monitoring Zones',
      value: zonesVal,
      icon: MapPin,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'sources',
      title: 'Data Sources',
      value: sourcesVal,
      icon: Database,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: activeAlertsVal,
      trend: anomalyCountText,
      icon: AlertTriangle,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.2)',
      isAction: true
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }} className="top-kpi-strip">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={card.id}
            className="card-panel"
            onClick={() => {
              if (card.id === 'alerts') setActiveTab('risk');
              else if (card.id === 'zones') setActiveTab('liveMap');
              else setActiveTab('analytics');
            }}
            style={{ 
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(13, 19, 28, 0.92)',
              border: card.isAction ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{ 
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent size={20} />
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>
                  {card.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                    {card.value}
                  </span>
                  {card.trend && (
                    <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>
                      {card.trend}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {card.isAction && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('risk');
                }}
                style={{
                  background: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid rgba(244, 63, 94, 0.5)',
                  color: '#fb7185',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
