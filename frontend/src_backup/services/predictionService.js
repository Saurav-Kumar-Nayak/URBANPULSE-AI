import { api } from './api';

export const predictionService = {
  getMetadata: async () => {
    return await api.getPredictionsMeta();
  },
  runPrediction: async (payload) => {
    return await api.predict(payload);
  }
};

export default predictionService;
