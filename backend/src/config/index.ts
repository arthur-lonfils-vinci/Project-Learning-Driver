import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Generate a default JWT secret if not provided
const defaultJwtSecret = Array.from({ length: 64 }, () =>
  Math.floor(Math.random() * 16).toString(16)
).join('');

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || defaultJwtSecret,
  database: {
    path: '/backend/data/app.db',
    saveInterval: 5000, // Save every 5 seconds
  },
};

// Log loaded configuration (excluding sensitive data)
console.log('Environment Variables Loaded:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET ? '[SECRET]' : '[DEFAULT]',
});