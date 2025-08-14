// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    AUTH: '/api/auth',
    SERVICES: '/api/services',
    NOTIFICATIONS: '/api/notifications',
    ACTIVITIES: '/api/activities',
  },
  TIMEOUT: 10000, // 10 seconds
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Belediye Admin Panel',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 10,
};
