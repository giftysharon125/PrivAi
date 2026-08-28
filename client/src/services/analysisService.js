import api from './api';

export const runAIAnalysis = async (documentId, preferredProvider) => {
  const response = await api.post(`/analysis/${documentId}`, { preferredProvider });
  return response.data;
};

export const getDocumentAnalysis = async (documentId) => {
  const response = await api.get(`/analysis/${documentId}`);
  return response.data;
};
