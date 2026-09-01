import axios from 'axios';

const api = axios.create({
  baseURL: 'https://staynest-api.onrender.com/api',   // apna Render URL yahan daalo
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('staynest_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;