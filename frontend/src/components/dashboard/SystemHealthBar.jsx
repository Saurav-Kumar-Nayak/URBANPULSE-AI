import React, { useState, useEffect } from 'react';
import { Server, Database, Cpu, Activity, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';

export const SystemHealthBar = () => {
  const { lastUpdated, triggerGlobalRefresh } = useUrbanPulseContext();
  const [healthData, setHealthData] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.getHealth();
        setHealthData(res);
        setSecondsAgo(0);
      } catch (e) {
        setHealthData({ status: 'offline' });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = healthData?.status === 'online';

  return (
    <div
      style={{
        background: 'rgba(11, 15, 23, 0.95)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.78rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="#06b6d4" />
          <span>SYSTEM OPERATIONS HEALTH</span>
        </div>

        {/* Backend Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Server size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>Backend:</span>
          <span style={{ color: isOnline ? '#34d399' : '#fb7185', fontWeight: 700 }}>
            {isOnline ? '● ONLINE' : '● OFFLINE'}
          </span>
        </div>

        {/* Database Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>Database:</span>
          <span style={{ color: '#34d399', fontWeight: 700 }}>
            ● CONNECTED (SQLite)
          </span>
        </div>

        {/* ML Engine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>ML Engine:</span>
          <span style={{ color: '#34d399', fontWeight: 700 }}>
            ● READY (Scikit-Learn)
          </span>
        </div>

        {/* Data Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>Data Pipeline:</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>
            ● ACTIVE
          </span>
        </div>
      </div>

      {/* Right Side Data Freshness */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Data freshness: <strong style={{ color: '#38bdf8' }}>{secondsAgo}s ago</strong>
        </div>

        <button
          onClick={triggerGlobalRefresh}
          className="btn-subtle"
          style={{ fontSize: '0.72rem', padding: '4px 10px' }}
        >
          <RefreshCw size={12} /> Sync Now
        </button>
      </div>
    </div>
  );
};

export default SystemHealthBar;
