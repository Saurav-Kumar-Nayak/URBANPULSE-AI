import { api } from './api';

export const environmentService = {
  getPollutionData: async () => {
    return await api.getPollution();
  },
  getLocations: async () => {
    return await api.getLocations();
  }
};

export default environmentService;
