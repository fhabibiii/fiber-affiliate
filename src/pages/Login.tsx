
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { indonesianTexts } from '@/constants/texts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';
import { LoginCredentials } from '@/types/auth';

const loginSchema = z.object({
  username: z.string().min(1, indonesianTexts.login.errors.required),
  password: z.string().min(1, indonesianTexts.login.errors.required),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'ADMIN' ? '/admin' : '/affiliator';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      // Convert form data to LoginCredentials type
      const credentials: LoginCredentials = {
        username: data.username,
        password: data.password,
      };
      await login(credentials);
      
      // Redirect based on user role
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        // Default redirect based on role will be handled by the useEffect above
      }
    } catch (error) {
      // Error is handled in the AuthContext
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAdminCredentials = () => {
    setValue('username', 'admin');
    setValue('password', 'admin123');
  };

  const setAffiliatorCredentials = () => {
    setValue('username', 'affiliator');
    setValue('password', 'affiliator123');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient-slow dark:animate-gradient-slow-dark"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Login Form */}
        <Card className="shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-gray-900 dark:text-white">
              {indonesianTexts.login.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {indonesianTexts.login.username}
                </Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register('username')}
                  className={`mt-1 ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Masukkan nama pengguna"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {indonesianTexts.login.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Masukkan kata sandi"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Demo Credentials */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Kredensial untuk testing:</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={setAdminCredentials}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={setAffiliatorCredentials}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Affiliator
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {indonesianTexts.login.loading}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    {indonesianTexts.login.submit}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
