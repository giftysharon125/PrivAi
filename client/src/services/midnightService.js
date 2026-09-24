import api from './api';

export const generateMidnightProof = async (documentId, checkId) => {
  const response = await api.post('/midnight/generate-proof', {
    documentId,
    checkId
  });
  return response.data;
};

export const verifyMidnightProof = async (proofHash) => {
  const response = await api.post('/midnight/verify-proof', { proofHash });
  return response.data;
};

export const getCompactContractSpec = async () => {
  const response = await api.get('/midnight/contract-spec');
  return response.data;
};
