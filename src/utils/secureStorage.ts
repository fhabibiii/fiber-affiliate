
import { APP_CONFIG, STORAGE_KEYS } from '@/config/environment';

// Simple encryption/decryption using base64 and basic transformation
class SecureStorage {
  private encrypt(data: string): string {
    try {
      // Simple encoding - in production, use proper encryption
      const encoded = btoa(data);
      return encoded.split('').reverse().join('');
    } catch {
      return data;
    }
  }

  private decrypt(data: string): string {
    try {
      const reversed = data.split('').reverse().join('');
      return atob(reversed);
    } catch {
      return data;
    }
  }

  setUser(user: any): void {
    try {
      const userData = JSON.stringify(user);
      const encrypted = this.encrypt(userData);
      sessionStorage.setItem(STORAGE_KEYS.USER, encrypted);
    } catch (error) {
      console.error('Failed to store user data');
    }
  }

  getUser(): any | null {
    try {
      const encrypted = sessionStorage.getItem(STORAGE_KEYS.USER);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch {
      this.clearUser();
      return null;
    }
  }

  clearUser(): void {
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  }

  setSessionId(sessionId: string): void {
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }

  getSessionId(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  }
}

export const secureStorage = new SecureStorage();
