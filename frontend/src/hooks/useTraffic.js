import { useState, useEffect, useCallback } from 'react';
import trafficService from '../services/trafficService';

export const useTraffic = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTraffic = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await trafficService.getTrafficData();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load traffic intelligence data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraffic();
  }, [fetchTraffic]);

  return { data, loading, error, refetch: fetchTraffic };
};

export default useTraffic;
