import api from './api';

export const runEligibilityCheck = async (documentId, customRequirements) => {
  const response = await api.post('/eligibility/check', {
    documentId,
    customRequirements
  });
  return response.data;
};

export const getEligibilityHistory = async () => {
  const response = await api.get('/eligibility/history');
  return response.data;
};

export const getEligibilityDetails = async (id) => {
  const response = await api.get(`/eligibility/${id}`);
  return response.data;
};
