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
  }
};

export default dashboardService;
