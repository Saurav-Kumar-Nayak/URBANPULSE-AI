import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getOverview();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load urban intelligence data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};

export default useDashboard;
