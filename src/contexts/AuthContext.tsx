
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials } from '@/types/auth';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { indonesianTexts } from '@/constants/texts';

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
        const savedUser = localStorage.getItem('user');
        
        console.log('Checking existing auth:', { hasUser: !!savedUser });
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('Found saved user:', parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid data
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Starting login process');
      
      const response = await apiService.login(credentials);
      console.log('AuthContext: Login response received:', response);
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('AuthContext: User set and saved to localStorage');
      
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${response.user.fullName}!`,
      });
      
      // Redirect to appropriate dashboard
      const redirectPath = response.user.role === 'ADMIN' ? '/admin' : '/affiliator';
      window.location.href = redirectPath;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : indonesianTexts.login.errors.invalid;
      
      toast({
        title: "Login gagal",
        description: errorMessage,
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  // Remove refreshToken function as it's handled automatically by cookies
  const refreshToken = async (): Promise<boolean> => {
    // This is no longer needed with httpOnly cookies
    // The backend handles refresh automatically
    return true;
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
