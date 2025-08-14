import axios from 'axios';
import { getBaseURL, getTimeout, getRetryAttempts } from '../config/api.config.js';

// Backend sunucu adresi - config dosyasından alınıyor
const API_BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: getTimeout(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

// Retry logic for failed requests
const retryRequest = async (fn, retries = getRetryAttempts()) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      console.log(`Retrying request... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// API functions
export const apiService = {
  // Tüm mobil verileri tek seferde getir (backend'deki /mobile/data endpoint'i kullan)
  getMobileData: async () => {
    try {
      const response = await retryRequest(() => api.get('/mobile/data'));
      return response;
    } catch (error) {
      console.error('Mobil veri yüklenirken hata:', error);
      throw error;
    }
  },

  // Hizmetleri getir
  getServices: async () => {
    try {
      const response = await retryRequest(() => api.get('/api/services'));
      return response;
    } catch (error) {
      console.error('Hizmetler yüklenirken hata:', error);
      throw error;
    }
  },

  // Bildirimleri getir
  getNotifications: async () => {
    try {
      const response = await retryRequest(() => api.get('/api/notifications'));
      return response;
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      throw error;
    }
  },

  // Faaliyetleri getir (tümü - admin panel için)
  getActivities: async () => {
    try {
      const response = await retryRequest(() => api.get('/api/activities'));
      return response;
    } catch (error) {
      console.error('Faaliyetler yüklenirken hata:', error);
      throw error;
    }
  },

  // Aktif faaliyetleri getir (mobil uygulama için)
  getActiveActivities: async () => {
    try {
      const response = await retryRequest(() => api.get('/api/activities/active'));
      return response;
    } catch (error) {
      console.error('Aktif faaliyetler yüklenirken hata:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('Health check hatası:', error);
      throw error;
    }
  },

  // Yeni veri kontrolü (değişiklik var mı?)
  checkForUpdates: async (lastUpdateTime) => {
    try {
      const response = await api.get('/mobile/data', {
        headers: {
          'If-Modified-Since': lastUpdateTime
        }
      });
      return response;
    } catch (error) {
      if (error.response?.status === 304) {
        // Değişiklik yok
        return null;
      }
      throw error;
    }
  },
};

export default api;
