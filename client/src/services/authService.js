import api from './api';

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('privai_token', response.data.token);
    localStorage.setItem('privai_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('privai_token', response.data.token);
    localStorage.setItem('privai_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

export const logoutUser = () => {
  localStorage.removeItem('privai_token');
  localStorage.removeItem('privai_user');
};
