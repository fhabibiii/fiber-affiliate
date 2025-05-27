
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
      const credentials: LoginCredentials = {
        username: data.username,
        password: data.password,
      };
      await login(credentials);
      
      if (from !== '/') {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Masuk...
                  </>
                ) : (
                  <>
                    <LogIn className="-ml-1 mr-3 h-5 w-5" />
                    {indonesianTexts.login.signIn}
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
