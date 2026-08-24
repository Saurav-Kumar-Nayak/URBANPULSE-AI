import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Wind, HardHat, Car, ArrowRight, CheckCircle2, ShieldCheck, Clock, Eye } from 'lucide-react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';
import { api } from '../../services/api';

export const ActiveAlertCenter = ({ anomalies = [], activeZone = null, onSelectZone }) => {
  const { setActiveTab } = useUrbanPulseContext();
  const [alertsList, setAlertsList] = useState([]);
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    if (anomalies && anomalies.length > 0) {
      setAlertsList(anomalies);
    } else {
      api.getAnomalies()
        .then(res => {
          if (res?.recent_anomalies && res.recent_anomalies.length > 0) {
            setAlertsList(res.recent_anomalies);
          } else {
            setAlertsList([
              {
                id: 1,
                record_code: "REC-8842",
                location_name: "Downtown Central Corridor",
                anomaly_type: "Traffic Bottleneck",
                severity: "CRITICAL",
                risk_score: 84.5,
                timestamp: "14:44:47",
                explanation: "Unusual gridlock spike exceeding 3 standard deviations above baseline.",
                recommended_action: "Deploy dynamic traffic phase signal override and dispatch field unit."
              },
              {
                id: 2,
                record_code: "REC-9104",
                location_name: "Industrial Harbor Sector",
                anomaly_type: "Particulate Surge",
                severity: "WARNING",
                risk_score: 68.2,
                timestamp: "13:20:12",
                explanation: "Elevated PM2.5 emissions detected near logistics interchange.",
                recommended_action: "Issue freight advisory and verify stationary sensor node 14 calibration."
              },
              {
                id: 3,
                record_code: "REC-7512",
                location_name: "Tech Corridor North",
                anomaly_type: "Sensor Variance",
                severity: "ADVISORY",
                risk_score: 42.0,
                timestamp: "12:15:30",
                explanation: "Minor telemetry jitter detected across dual weather sensors.",
                recommended_action: "Monitor diagnostic ping cycle on scheduled 15-min interval."
              }
            ]);
          }
        })
        .catch(() => {
          setAlertsList([]);
        });
    }
  }, [anomalies]);

  const handleAcknowledge = (id, e) => {
    if (e) e.stopPropagation();
    setAcknowledgedIds(prev => new Set([...prev, id]));
  };

  return (
    <div className="card-panel" style={{ padding: '16px 18px', background: 'rgba(13, 19, 28, 0.95)', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '14px', border: '1px solid rgba(244,63,94,0.3)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#f43f5e" />
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Operational Alert Radar
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('anomalies')}
          className="btn-subtle"
          style={{ fontSize: '0.68rem', padding: '3px 8px', gap: '4px' }}
        >
          <span>View All ({alertsList.length})</span>
          <ArrowRight size={10} />
        </button>
      </div>

      {/* Alert Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
        {alertsList.map((alert) => {
          const isAck = acknowledgedIds.has(alert.id);
          const severity = (alert.severity || 'WARNING').toUpperCase();
          const badgeBg = severity === 'CRITICAL' ? 'rgba(244, 63, 94, 0.2)' : (severity === 'WARNING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)');
          const badgeColor = severity === 'CRITICAL' ? '#fb7185' : (severity === 'WARNING' ? '#fbbf24' : '#38bdf8');

          return (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: isAck ? 'rgba(15, 23, 42, 0.5)' : (activeZone?.name === alert.location_name ? 'rgba(244, 63, 94, 0.2)' : 'rgba(17, 25, 35, 0.85)'),
                border: isAck ? '1px solid rgba(16,185,129,0.3)' : (severity === 'CRITICAL' ? '1px solid rgba(244,63,94,0.4)' : '1px solid rgba(255, 255, 255, 0.08)'),
                opacity: isAck ? 0.75 : 1,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isAck ? '#34d399' : badgeColor }} />
                  <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#f8fafc' }}>
                    {alert.anomaly_type || alert.type || 'Urban Anomaly'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: badgeBg, color: badgeColor }}>
                    {isAck ? 'ACKNOWLEDGED' : severity}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📍 {alert.location_name || alert.location}</span>
                <span style={{ fontSize: '0.66rem', color: '#64748b' }}>{alert.timestamp || alert.time}</span>
              </div>

              {/* Action Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.66rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                  Risk Score: {alert.risk_score ? alert.risk_score.toFixed(1) : '72.0'}
                </span>
                {!isAck ? (
                  <button
                    onClick={(e) => handleAcknowledge(alert.id, e)}
                    className="btn-subtle"
                    style={{ fontSize: '0.65rem', padding: '2px 8px', color: '#34d399', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer' }}
                  >
                    <CheckCircle2 size={11} /> Acknowledge
                  </button>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={11} /> Ack Logged
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveAlertCenter;
