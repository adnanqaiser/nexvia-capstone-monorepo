import axios from 'axios';

// Centralized Axios instance configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Global Dynamic Interceptor Instance.
 * Automatically inspects browser localStorage and injects 'Bearer [Token]' structure
 * into outgoing request authorization headers.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Interceptor Response Warning]:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
