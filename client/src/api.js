import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('crew_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminApi = axios.create({ baseURL: '/api' });
adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const portalApi = axios.create({ baseURL: '/api/portal' });
portalApi.interceptors.request.use(config => {
  const token = localStorage.getItem('crew_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
