import React, { useState, useEffect } from 'react';
import PollutionIntelligenceView from '../components/PollutionIntelligenceView';
import { api } from '../services/api';

export default function PollutionPage() {
  const [pollution, setPollution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPollution()
      .then(res => setPollution(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading pollution analytics...</div>
      ) : (
        <PollutionIntelligenceView pollutionData={pollution} />
      )}
    </div>
  );
}
