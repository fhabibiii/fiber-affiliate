
interface Environment {
  API_BASE_URL: string;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

const getEnvironment = (): Environment => {
  const nodeEnv = import.meta.env.MODE || 'development';
  
  return {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://1d18-2404-c0-3650-00-98a6-b79a.ngrok-free.app/api/v1',
    NODE_ENV: nodeEnv,
    IS_DEVELOPMENT: nodeEnv === 'development',
    IS_PRODUCTION: nodeEnv === 'production',
  };
};

export const env = getEnvironment();
