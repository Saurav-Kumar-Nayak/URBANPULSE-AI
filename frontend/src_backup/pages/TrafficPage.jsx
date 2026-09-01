import React, { useState, useEffect } from 'react';
import TrafficIntelligenceView from '../components/TrafficIntelligenceView';
import { api } from '../services/api';

export default function TrafficPage() {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTraffic()
      .then(res => setTraffic(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading traffic telemetry...</div>
      ) : (
        <TrafficIntelligenceView trafficData={traffic} />
      )}
    </div>
  );
}
