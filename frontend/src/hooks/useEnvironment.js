import { useState, useEffect, useCallback } from 'react';
import environmentService from '../services/environmentService';

export const useEnvironment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnvironment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await environmentService.getPollutionData();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load environmental intelligence data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnvironment();
  }, [fetchEnvironment]);

  return { data, loading, error, refetch: fetchEnvironment };
};

export default useEnvironment;
