import { api } from './api';

export const trafficService = {
  getTrafficData: async () => {
    return await api.getTraffic();
  },
  getLocations: async () => {
    return await api.getLocations();
  }
};

export default trafficService;
