import api from './api';

export const uploadDocument = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    }
  });
  return response.data;
};

export const loadSampleDocument = async (sampleType = 'eligible_cse') => {
  const response = await api.post('/documents/demo-sample', { sampleType });
  return response.data;
};

export const getUserDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const getDocumentDetails = async (id) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};
