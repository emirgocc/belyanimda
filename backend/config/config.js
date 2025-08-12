import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  DB_PATH: process.env.DB_PATH || './database/data'
};
