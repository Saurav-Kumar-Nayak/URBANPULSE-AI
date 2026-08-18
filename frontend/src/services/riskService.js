import { api } from './api';

export const riskService = {
  getAnomalies: async (params = {}) => {
    return await api.getAnomalies(params);
  },
  detectAnomaly: async (payload) => {
    return await api.detectAnomaly(payload);
  }
};

export default riskService;
