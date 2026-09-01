import { api } from './api';

export const mlService = {
  getModelSpecs: async () => {
    return await api.getPredictionsMeta();
  }
};

export default mlService;
