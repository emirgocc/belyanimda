import axios from 'axios';
import { API_CONFIG } from '../config/config.js';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.AUTH}/login`, credentials);
    return response.data;
  },
  
  verify: async () => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.AUTH}/verify`);
    return response.data;
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.SERVICES);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`);
    return response.data;
  },
  
  create: async (service) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.SERVICES, service);
    return response.data;
  },
  
  update: async (id, service) => {
    const response = await api.put(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`, service);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`);
    return response.data;
  },
  
  reorder: async (orderedIds) => {
    const response = await api.put(`${API_CONFIG.ENDPOINTS.SERVICES}/reorder/batch`, { orderedIds });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}`);
    return response.data;
  },
  
  create: async (notification) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS, notification);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}`);
    return response.data;
  },
};

export default api;
