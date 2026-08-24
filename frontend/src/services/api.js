import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});

// Attach Authorization Bearer token automatically if stored
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('urbanpulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const api = {
  // Authentication
  login: async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout network errors
    }
  },

  // Health
  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Overview
  getOverview: async () => {
    const res = await apiClient.get('/overview');
    return res.data;
  },

  // Traffic
  getTraffic: async (params = {}) => {
    const res = await apiClient.get('/traffic', { params });
    return res.data;
  },

  // Pollution
  getPollution: async (params = {}) => {
    const res = await apiClient.get('/pollution', { params });
    return res.data;
  },

  // Anomalies
  getAnomalies: async (params = {}) => {
    const res = await apiClient.get('/anomalies', { params });
    return res.data;
  },
  detectAnomaly: async (payload) => {
    const res = await apiClient.post('/anomalies/detect', payload);
    return res.data;
  },

  // Predictions
  getPredictionsMeta: async () => {
    const res = await apiClient.get('/predictions');
    return res.data;
  },
  predict: async (payload) => {
    const res = await apiClient.post('/predictions/predict', payload);
    return res.data;
  },

  // Insights
  getInsights: async () => {
    const res = await apiClient.get('/insights');
    return res.data;
  },

  // Locations
  getLocations: async () => {
    const res = await apiClient.get('/locations');
    return res.data;
  },

  // Data Explorer
  getExplorerData: async (params = {}) => {
    const res = await apiClient.get('/explorer', { params });
    return res.data;
  },

  // Analytics
  getAnalytics: async () => {
    const res = await apiClient.get('/analytics');
    return res.data;
  }
};
