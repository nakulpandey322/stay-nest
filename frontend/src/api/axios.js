import axios from 'axios';

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || '/api',  // Paste Your Render URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('staynest_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
