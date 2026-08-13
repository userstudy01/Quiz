import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const API = axios.create({ baseURL, timeout: 20000 });

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem('adminUser')) || null;
  } catch {
    return null;
  }
};

export const clearAuth = () => localStorage.removeItem('adminUser');

// Attach the JWT to every request.
API.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// An expired or invalid token ends the session immediately.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const apiError = (error, fallback = 'Request failed. Please try again.') =>
  error?.response?.data?.errors?.join(' ') || error?.response?.data?.message || fallback;

export default API;
