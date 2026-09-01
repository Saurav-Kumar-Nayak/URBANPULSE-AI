import { useState, useEffect, useCallback } from 'react';
import mlService from '../services/mlService';

export const useMLModels = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMLModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mlService.getModelSpecs();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load ML model specifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMLModels();
  }, [fetchMLModels]);

  return { data, loading, error, refetch: fetchMLModels };
};

export default useMLModels;
