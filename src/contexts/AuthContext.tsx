
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials } from '@/types/auth';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { indonesianTexts } from '@/constants/texts';
import { logger } from '@/utils/logger';
import { secureStorage } from '@/utils/secureStorage';
import { sanitizeError } from '@/utils/errorHandler';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = secureStorage.getItem('user');
        const token = secureStorage.getItem('token');
        
        logger.log('Checking existing auth:', { hasUser: !!savedUser, hasToken: !!token });
        
        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser);
          logger.log('Found saved user');
          setUser(parsedUser);
        }
      } catch (error) {
        logger.error('Auth check failed:', error);
        // Clear invalid data
        secureStorage.removeItem('user');
        secureStorage.removeItem('token');
        secureStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    const token = secureStorage.getItem('token');
    if (token && user) {
      const interval = setInterval(async () => {
        try {
          await apiService.refreshTokenRequest();
          logger.log('Token refreshed successfully');
        } catch (error) {
          logger.error('Token refresh failed:', error);
          // Force logout on refresh failure
          logout();
        }
      }, 15000); // Refresh every 15 seconds as suggested

      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      logger.log('AuthContext: Starting login process');
      
      const response = await apiService.login(credentials);
      logger.log('AuthContext: Login response received');
      
      setUser(response.user);
      secureStorage.setItem('user', JSON.stringify(response.user));
      
      logger.log('AuthContext: User set and saved to storage');
      
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${response.user.fullName}!`,
      });
      
      // Redirect to appropriate dashboard
      const redirectPath = response.user.role === 'ADMIN' ? '/admin' : '/affiliator';
      window.location.href = redirectPath;
    } catch (error) {
      logger.error('AuthContext: Login failed:', error);
      const sanitizedError = sanitizeError(error);
      
      toast({
        title: "Login gagal",
        description: sanitizedError.userMessage || indonesianTexts.login.errors.invalid,
        variant: "destructive",
      });
      throw sanitizedError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      setUser(null);
      secureStorage.removeItem('user');
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await apiService.refreshTokenRequest();
      // Update user data with fresh data from refresh response
      setUser(response.user);
      secureStorage.setItem('user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
