
export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://14fd-2404-c0-3740-00-a64c-1454.ngrok-free.app/api/v1',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  IS_PRODUCTION: import.meta.env.VITE_APP_ENV === 'production',
  IS_DEVELOPMENT: import.meta.env.VITE_APP_ENV === 'development',
  APP_NAME: 'Fibernode Internet',
  REQUEST_TIMEOUT: 10000,
  TOKEN_REFRESH_INTERVAL: 15000,
} as const;

export const STORAGE_KEYS = {
  USER: 'fibernode_user',
  SESSION_ID: 'fibernode_session',
} as const;
