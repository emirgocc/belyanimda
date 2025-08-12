import axios from 'axios';

// TODO: API base URL'ini güncelleyin
const API_BASE_URL = 'http://localhost:3001'; // Backend sunucu adresi

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Hizmetleri getir
  getServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      console.error('Hizmetler yüklenirken hata:', error);
      // Fallback data for development
      return [
        { id: 1, name: 'Günggören Akademi', logoUrl: 'https://via.placeholder.com/80', linkUrl: 'https://example.com' },
        { id: 2, name: 'Spor Güngören', logoUrl: 'https://via.placeholder.com/80', linkUrl: 'https://example.com' },
        { id: 3, name: 'GKS', logoUrl: 'https://via.placeholder.com/80', linkUrl: 'https://example.com' },
        { id: 4, name: 'Harımeli Konağı', logoUrl: 'https://via.placeholder.com/80', linkUrl: 'https://example.com' },
        { id: 5, name: 'Bilim Güngören', logoUrl: 'https://via.placeholder.com/80', linkUrl: 'https://example.com' },
        { id: 6, name: 'Aile Çocuk Kampüsü', logoUrl: 'https://via.placeholder.com/80', linkUrl: 'https://example.com' },
      ];
    }
  },

  // Bildirimleri getir
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      // Fallback data for development
      return [
        { id: 1, title: 'Hoş Geldiniz', message: 'Belyanımda uygulamasına hoş geldiniz!', date: '2024-01-15' },
        { id: 2, title: 'Yeni Hizmet', message: 'Güngören Akademi artık uygulamada!', date: '2024-01-14' },
        { id: 3, title: 'Güncelleme', message: 'Uygulama güncellendi.', date: '2024-01-13' },
      ];
    }
  },
};

export default api;
