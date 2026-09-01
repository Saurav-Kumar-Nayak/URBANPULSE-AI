import { api } from './api';

export const dashboardService = {
  getOverview: async () => {
    return await api.getOverview();
  },
  getHealth: async () => {
    return await api.getHealth();
  },
  getLocations: async () => {
    return await api.getLocations();
  },
  getTraffic: async (params = {}) => {
    return await api.getTraffic(params);
  },
  getPollution: async (params = {}) => {
    return await api.getPollution(params);
  },
  getAnomalies: async (params = {}) => {
    return await api.getAnomalies(params);
  }
};

export default dashboardService;
