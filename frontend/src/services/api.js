import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '') : '';
const API_BASE = rawBase ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`) : '/api';

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
  updateAnomalyStatus: async (anomalyId, status) => {
    const res = await apiClient.patch(`/anomalies/${anomalyId}/status`, { status });
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
  getRecords: async (params = {}) => {
    const res = await apiClient.get('/records', { params });
    return res.data;
  },
  getExplorerData: async (params = {}) => {
    const res = await apiClient.get('/records', { params });
    return res.data;
  },
  getExportUrl: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const base = API_BASE.replace(/\/+$/, '');
    return `${base}/records/export${queryString ? `?${queryString}` : ''}`;
  },

  // Analytics
  getAnalytics: async () => {
    const res = await apiClient.get('/analytics/kpis');
    return res.data;
  }
};
