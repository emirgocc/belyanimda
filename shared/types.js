/**
 * @typedef {Object} Service
 * @property {string} id - Unique identifier
 * @property {string} name - Service name
 * @property {string} icon - Icon URL or name
 * @property {string} url - Service URL to open in WebView
 * @property {boolean} active - Whether service is active
 * @property {number} order - Display order (lower = higher priority)
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier
 * @property {string} title - Notification title (required)
 * @property {string} [description] - Optional description
 * @property {string} [url] - Optional URL to open
 * @property {string} createdAt - ISO timestamp
 * @property {boolean} [read] - Read status (client-side only)
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} username - Admin username
 * @property {string} password - Admin password (hashed)
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Request success status
 * @property {any} [data] - Response data
 * @property {string} [message] - Error or success message
 * @property {number} [count] - Total count for paginated responses
 */

// Export empty object to make this a module
export {};
