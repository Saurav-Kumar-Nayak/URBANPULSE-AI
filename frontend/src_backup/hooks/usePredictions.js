import { useState, useEffect, useCallback } from 'react';
import predictionService from '../services/predictionService';

export const usePredictions = () => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetadata = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await predictionService.getMetadata();
      setMetadata(res);
    } catch (err) {
      setError(err.message || 'Unable to load prediction metadata.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return { metadata, loading, error, refetch: fetchMetadata };
};

export default usePredictions;
