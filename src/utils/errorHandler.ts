
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public userMessage: string = 'Terjadi kesalahan sistem',
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const sanitizeError = (error: any): { message: string; userMessage: string } => {
  // Log detailed error for debugging (only in development)
  logger.error('Error occurred:', error);

  // Default user-friendly message
  let userMessage = 'Terjadi kesalahan. Silakan coba lagi.';
  let message = 'Unknown error';

  if (error instanceof AppError) {
    return { message: error.message, userMessage: error.userMessage };
  }

  if (error?.message) {
    message = error.message;
    
    // Map technical errors to user-friendly messages
    if (error.message.includes('fetch')) {
      userMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else if (error.message.includes('timeout')) {
      userMessage = 'Koneksi timeout. Silakan coba lagi.';
    } else if (error.message.includes('401')) {
      userMessage = 'Sesi telah berakhir. Silakan login kembali.';
    } else if (error.message.includes('403')) {
      userMessage = 'Anda tidak memiliki akses untuk melakukan tindakan ini.';
    } else if (error.message.includes('404')) {
      userMessage = 'Data tidak ditemukan.';
    } else if (error.message.includes('429')) {
      userMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar.';
    } else if (error.message.includes('500')) {
      userMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
    }
  }

  return { message, userMessage };
};
