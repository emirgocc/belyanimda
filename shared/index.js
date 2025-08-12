// Re-export all constants and types
export * from './constants.js';
export * from './types.js';

// Utility functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateService = (service) => {
  if (!service.name || typeof service.name !== 'string' || service.name.trim().length === 0) {
    return { valid: false, error: 'Service name is required' };
  }
  
  if (!service.url || typeof service.url !== 'string' || !isValidUrl(service.url)) {
    return { valid: false, error: 'Valid service URL is required' };
  }
  
  return { valid: true };
};

export const validateNotification = (notification) => {
  if (!notification.title || typeof notification.title !== 'string' || notification.title.trim().length === 0) {
    return { valid: false, error: 'Notification title is required' };
  }
  
  if (notification.url && !isValidUrl(notification.url)) {
    return { valid: false, error: 'Invalid URL provided' };
  }
  
  return { valid: true };
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
