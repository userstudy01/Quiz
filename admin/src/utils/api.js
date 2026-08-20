import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const API = axios.create({ baseURL, timeout: 20000 });

// Roles allowed to sign in to the admin panel. Kept in one place so the login
// gate and route guard stay in sync.
export const ADMIN_ROLES = ['admin', 'superadmin'];

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

// An expired or invalid token ends the session immediately. The app's
// AuthWatcher listens for this event and redirects within the router (no full
// reload); the hard redirect is only a fallback if nothing handles it.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auth endpoints report their own 401s (e.g. wrong password) inline; only a
    // 401 on a normal request means the session token itself is gone.
    const url = error?.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/password') || url.includes('/auth/login');
    if (error?.response?.status === 401 && !isAuthEndpoint) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        const handled = window.dispatchEvent(new CustomEvent('auth:unauthorized', { cancelable: true }));
        // dispatchEvent returns false only if a listener called preventDefault();
        // AuthWatcher does, so a handled event skips the hard redirect.
        if (handled) window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const apiError = (error, fallback = 'Request failed. Please try again.') =>
  error?.response?.data?.errors?.join(' ') || error?.response?.data?.message || fallback;

export default API;
