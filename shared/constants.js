// API Endpoints
export const API_ENDPOINTS = {
  SERVICES: '/api/services',
  NOTIFICATIONS: '/api/notifications',
  AUTH: '/api/auth'
};

// Service object keys
export const SERVICE_KEYS = {
  ID: 'id',
  NAME: 'name',
  ICON: 'icon',
  URL: 'url',
  ACTIVE: 'active',
  ORDER: 'order',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
};

// Notification object keys
export const NOTIFICATION_KEYS = {
  ID: 'id',
  TITLE: 'title',
  DESCRIPTION: 'description',
  URL: 'url',
  CREATED_AT: 'createdAt',
  READ: 'read'
};

// Admin panel navigation
export const ADMIN_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  SERVICES: '/services',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings'
};



// API Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Default values
export const DEFAULTS = {
  REFRESH_INTERVAL: 5000, // 5 seconds
  CACHE_DURATION: 300000, // 5 minutes
  MAX_SERVICES: 50,
  MAX_NOTIFICATIONS: 100
};
