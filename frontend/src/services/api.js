import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});

export const api = {
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
  getRecords: async (params = {}) => {
    const res = await apiClient.get('/records', { params });
    return res.data;
  },
  getExportUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `${API_BASE}/records/export${query ? `?${query}` : ''}`;
  }
};
