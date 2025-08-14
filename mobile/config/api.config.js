// API Configuration for Mobile App
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Production environment
  production: {
    baseURL: 'https://your-production-api.com', // TODO: Update with actual production URL
    timeout: 15000,
    retryAttempts: 2,
  },
  
  // Local network (for testing on physical device)
  localNetwork: {
    baseURL: 'http://192.168.1.105:3000', // TODO: Update with your local IP
    timeout: 10000,
    retryAttempts: 3,
  }
};

// Current environment - change this to switch between environments
const CURRENT_ENV = 'localNetwork';

export const getApiConfig = () => {
  return API_CONFIG[CURRENT_ENV] || API_CONFIG.development;
};

export const getBaseURL = () => {
  return getApiConfig().baseURL;
};

export const getTimeout = () => {
  return getApiConfig().timeout;
};

export const getRetryAttempts = () => {
  return getApiConfig().retryAttempts;
};

export default API_CONFIG;
