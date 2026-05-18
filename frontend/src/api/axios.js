import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      localStorage.removeItem('user');
    }
  }

  return config;
});

export default API;

