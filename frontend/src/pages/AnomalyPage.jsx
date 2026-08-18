import React, { useState, useEffect } from 'react';
import AnomalyRadar from '../components/AnomalyRadar';
import { api } from '../services/api';

export default function AnomalyPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnomalyData = async () => {
    setLoading(true);
    try {
      const res = await api.getAnomalies({ limit: 50 });
      setAnomalies(res.recent_anomalies || []);
      setStats(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalyData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading anomaly telemetry stream...</div>
      ) : (
        <AnomalyRadar anomalies={anomalies} stats={stats} onRefresh={fetchAnomalyData} />
      )}
    </div>
  );
}
