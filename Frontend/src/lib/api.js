import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const api = axios.create({ baseURL, timeout: 20000 });

export const getProjects = (params) => api.get('/projects', { params }).then((r) => r.data);
export const getProjectFilters = () => api.get('/projects/meta').then((r) => r.data);
export const getFeaturedProjects = (limit = 6) =>
  api.get('/projects/featured', { params: { limit } }).then((r) => r.data);
export const getProject = (slug) => api.get(`/projects/${slug}`).then((r) => r.data);
export const getSkills = () => api.get('/skills').then((r) => r.data);
export const getExperience = () => api.get('/experience').then((r) => r.data);
export const getProfile = () => api.get('/profile').then((r) => r.data);
export const sendContactMessage = (payload) => api.post('/contact', payload).then((r) => r.data);

export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.errors?.join(' ') || error?.response?.data?.message || fallback;

export default api;
