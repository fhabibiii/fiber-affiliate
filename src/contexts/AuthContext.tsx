
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials } from '@/types/auth';
import { apiService } from '@/services/api';
import { mockAuthService } from '@/services/mockAuth';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';
import { logger } from '@/utils/logger';
import { sanitizeError, AppError } from '@/utils/errorHandler';
import { APP_CONFIG } from '@/config/environment';

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = secureStorage.getUser();
        
        logger.log('Checking existing auth:', { hasUser: !!savedUser });
        
        if (savedUser) {
          logger.log('Found saved user');
          setUser(savedUser);
        }
      } catch (error) {
        logger.error('Auth check failed:', error);
        secureStorage.clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user && APP_CONFIG.IS_DEVELOPMENT) {
      const interval = setInterval(async () => {
        try {
          // In cookie-based auth, we can check session validity by making a simple API call
          await apiService.getAffiliatorCustomers();
          logger.log('Session still valid');
        } catch (error) {
          logger.error('Session validation failed:', error);
          logout();
        }
      }, APP_CONFIG.TOKEN_REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      logger.log('AuthContext: Starting login process');
      
      // Use mock service if API is not accessible
      let response;
      try {
        response = await apiService.login(credentials);
      } catch (error) {
        logger.warn('API login failed, falling back to mock service:', error);
        response = await mockAuthService.login(credentials);
      }
      
      logger.log('AuthContext: Login response received');
      
      setUser(response.user);
      secureStorage.setUser(response.user);
      
      logger.log('AuthContext: User set and saved to secure storage');
      
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${response.user.fullName}!`,
      });
      
      const redirectPath = response.user.role === 'ADMIN' ? '/admin' : '/affiliator';
      window.location.href = redirectPath;
    } catch (error) {
      logger.error('AuthContext: Login failed:', error);
      
      const sanitized = sanitizeError(error);
      
      toast({
        title: "Login gagal",
        description: sanitized.userMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      logger.log('Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      setUser(null);
      secureStorage.clearUser();
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
      
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
