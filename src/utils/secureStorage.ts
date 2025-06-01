
// Simple encryption/decryption for sessionStorage
// Note: This is basic obfuscation, not cryptographically secure
// For production, consider implementing httpOnly cookies via backend
class SecureStorage {
  private encode(value: string): string {
    try {
      return btoa(encodeURIComponent(value));
    } catch {
      return value;
    }
  }

  private decode(value: string): string {
    try {
      return decodeURIComponent(atob(value));
    } catch {
      return value;
    }
  }

  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, this.encode(value));
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? this.decode(item) : null;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const secureStorage = new SecureStorage();
