import { useState, useEffect, useCallback } from 'react';
import riskService from '../services/riskService';

export const useRisk = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRisk = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await riskService.getAnomalies();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load risk anomaly data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRisk();
  }, [fetchRisk]);

  return { data, loading, error, refetch: fetchRisk };
};

export default useRisk;
