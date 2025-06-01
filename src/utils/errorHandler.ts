
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const sanitizeError = (error: any): AppError => {
  logger.error('Error occurred:', error);
  
  if (error instanceof AppError) {
    return error;
  }
  
  // Don't expose internal error details in production
  const userMessage = error?.message?.includes('fetch') 
    ? 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    : 'Terjadi kesalahan. Silakan coba lagi.';
    
  return new AppError(
    error?.message || 'Unknown error',
    error?.status || error?.statusCode,
    userMessage
  );
};
