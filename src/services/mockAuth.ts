
import { LoginCredentials, AuthResponse, User } from '@/types/auth';

// Mock data untuk testing
const mockUsers: { [key: string]: User } = {
  admin: {
    uuid: '1',
    fullName: 'Administrator',
    username: 'admin',
    phoneNumber: '081234567890',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
  },
  affiliator: {
    uuid: '2', 
    fullName: 'Affiliator Test',
    username: 'affiliator',
    phoneNumber: '081234567891',
    role: 'AFFILIATOR',
    createdAt: new Date().toISOString(),
  },
};

const mockPasswords: { [key: string]: string } = {
  admin: 'admin123',
  affiliator: 'affiliator123',
};

export class MockAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[credentials.username];
    const password = mockPasswords[credentials.username];
    
    if (!user || password !== credentials.password) {
      throw new Error('Username atau password salah');
    }
    
    return {
      user,
    };
  }

  async logout(): Promise<void> {
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const mockAuthService = new MockAuthService();
