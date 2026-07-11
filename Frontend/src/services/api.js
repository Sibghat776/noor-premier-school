import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getNotices = () => api.get('/notices');
export const createNotice = (data) => api.post('/notices', data);
export const updateNotice = (id, data) => api.put(`/notices/${id}`, data);
export const deleteNotice = (id) => api.delete(`/notices/${id}`);

export const submitAdmission = (data) => api.post('/admissions', data);
export const getAdmissions = () => api.get('/admissions');
export const updateAdmissionStatus = (id, status) => api.put(`/admissions/${id}/status`, { status });
export const deleteAdmission = (id) => api.delete(`/admissions/${id}`);

export const login = (data) => api.post('/auth/login', data);

export default api;
