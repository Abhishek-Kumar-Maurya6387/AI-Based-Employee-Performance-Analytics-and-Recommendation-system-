import axios from 'axios';

const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (!apiUrl) return '/api';

  const normalizedUrl = apiUrl.replace(/\/+$/, '');
  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
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
