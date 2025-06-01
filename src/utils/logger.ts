
import { APP_CONFIG } from '@/config/environment';

type LogLevel = 'log' | 'warn' | 'error' | 'info';

class Logger {
  private shouldLog(): boolean {
    return APP_CONFIG.IS_DEVELOPMENT;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Remove sensitive fields from logs
    const sensitiveFields = ['password', 'token', 'refreshToken', 'authorization', 'cookie'];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      });
      return sanitized;
    }
    
    return data;
  }

  log(message: string, ...data: any[]): void {
    if (this.shouldLog()) {
      console.log(`[${APP_CONFIG.APP_NAME}] ${message}`, ...data.map(this.sanitizeData));
    }
  }

  warn(message: string, ...data: any[]): void {
    if (this.shouldLog()) {
      console.warn(`[${APP_CONFIG.APP_NAME}] ${message}`, ...data.map(this.sanitizeData));
    }
  }

  error(message: string, ...data: any[]): void {
    if (this.shouldLog()) {
      console.error(`[${APP_CONFIG.APP_NAME}] ${message}`, ...data.map(this.sanitizeData));
    }
  }

  info(message: string, ...data: any[]): void {
    if (this.shouldLog()) {
      console.info(`[${APP_CONFIG.APP_NAME}] ${message}`, ...data.map(this.sanitizeData));
    }
  }
}

export const logger = new Logger();
