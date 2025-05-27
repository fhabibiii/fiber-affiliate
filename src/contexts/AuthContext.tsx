
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { indonesianTexts } from '@/constants/texts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiService.refreshTokenRequest();
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      return false;
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(credentials);
      setUser(response.user);
      
      toast({
        title: "Login berhasil",
        description: `${indonesianTexts.navigation.welcome}, ${response.user.fullName}!`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: indonesianTexts.login.errors.invalid,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    }
  }, [toast]);

  // Auto-refresh token every 10 seconds
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const interval = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        logout();
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [user, refreshToken, logout]);

  // Initial auth check
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
