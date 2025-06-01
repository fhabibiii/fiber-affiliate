import { LoginCredentials, AuthResponse, User } from '@/types/auth';
import { env } from '@/config/environment';
import { logger } from '@/utils/logger';
import { secureStorage } from '@/utils/secureStorage';
import { sanitizeError, AppError } from '@/utils/errorHandler';

const API_BASE_URL = env.API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Customer {
  uuid: string;
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  affiliatorUuid?: string;
  affiliatorName?: string;
  createdAt: string;
}

export interface Payment {
  uuid: string;
  affiliatorUuid: string;
  affiliatorName?: string;
  month: string;
  year: number;
  amount: number;
  paymentDate: string;
  proofImage: string;
  createdAt: string;
}

export interface Affiliator {
  uuid: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  role?: string;
  totalCustomers?: number;
  createdAt: string;
}

export interface AdminSummary {
  totalAffiliators: number;
  totalCustomers: number;
  totalPaymentThisMonth: number;
}

export interface StatItem {
  month: string;
  count?: number;
  amount?: number;
}

export interface AffiliatorSummary {
  totalCustomers: number;
  totalPaymentsSinceJoin: number;
}

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from secure storage on initialization
    this.accessToken = secureStorage.getItem('token');
    this.refreshToken = secureStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    secureStorage.setItem('token', accessToken);
    secureStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    secureStorage.removeItem('token');
    secureStorage.removeItem('refreshToken');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    logger.log('Making API request:', { url, method: options.method || 'GET' });

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);
      
      logger.log('API response status:', response.status);

      // Check if response is HTML (ngrok warning page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        logger.error('Received HTML response instead of JSON');
        throw new AppError(
          'Server returned HTML instead of JSON',
          500,
          'Server configuration error. Please contact support.'
        );
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          if (this.refreshToken && endpoint !== '/auth/refresh') {
            try {
              logger.log('Token expired, attempting refresh...');
              await this.refreshTokenRequest();
              // Retry the original request with new token
              headers['Authorization'] = `Bearer ${this.accessToken}`;
              const retryResponse = await fetch(url, {
                ...options,
                headers,
                cache: 'no-store',
              });
              
              if (!retryResponse.ok) {
                throw new AppError(`HTTP error! status: ${retryResponse.status}`, retryResponse.status);
              }
              
              // Handle empty response for delete operations
              if (retryResponse.status === 204 || retryResponse.headers.get('content-length') === '0') {
                return { success: true } as T;
              }
              
              return retryResponse.json();
            } catch (refreshError) {
              logger.error('Token refresh failed:', refreshError);
              this.clearTokens();
              throw new AppError(
                'Session expired',
                401,
                'Session expired. Please login again.'
              );
            }
          } else {
            this.clearTokens();
            throw new AppError(
              'Session expired',
              401,
              'Session expired. Please login again.'
            );
          }
        }
        
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        logger.error('API error response:', errorData);
        throw new AppError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData.message || 'Server error occurred'
        );
      }

      // Handle empty response for delete operations (204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true } as T;
      }

      const responseData = await response.json();
      logger.log('API response data received successfully');
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        logger.error('API request timeout');
        throw new AppError(
          'Request timeout',
          408,
          'Request timeout. Please check your internet connection.'
        );
      }
      
      // Use error handler for consistent error processing
      throw sanitizeError(error);
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    logger.log('Attempting login');
    
    try {
      const response = await this.makeRequest<{
        success: boolean;
        token: string;
        refreshToken: string;
        user: User;
        message?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      logger.log('Login response received');

      if (response.success) {
        this.setTokens(response.token, response.refreshToken);
        logger.log('Login successful, tokens saved');
        return {
          token: response.token,
          refreshToken: response.refreshToken,
          user: response.user
        };
      }

      throw new AppError(response.message || 'Login failed', 401, response.message || 'Invalid credentials');
    } catch (error) {
      logger.error('Login error:', error);
      throw sanitizeError(error);
    }
  }

  async refreshTokenRequest(): Promise<{ token: string; user: User }> {
    if (!this.refreshToken) {
      throw new AppError('No refresh token available', 401, 'Session expired');
    }

    logger.log('Attempting token refresh...');

    const response = await this.makeRequest<{
      success: boolean;
      token: string;
      user: User;
      message?: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (response.success) {
      this.accessToken = response.token;
      secureStorage.setItem('token', response.token);
      logger.log('Token refresh successful');
      return {
        token: response.token,
        user: response.user
      };
    }

    throw new AppError(response.message || 'Token refresh failed', 401, 'Session expired');
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Admin methods
  async getAdminSummary(): Promise<AdminSummary> {
    const response = await this.makeRequest<ApiResponse<AdminSummary>>('/admin/summary');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get admin summary', 500, 'Failed to get admin summary');
  }

  async getCustomerStats(year: number): Promise<StatItem[]> {
    const response = await this.makeRequest<ApiResponse<StatItem[]>>(`/admin/stats/customers?year=${year}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get customer statistics', 500, 'Failed to get customer statistics');
  }

  async getPaymentStats(year: number): Promise<StatItem[]> {
    const response = await this.makeRequest<ApiResponse<StatItem[]>>(`/admin/stats/payments?year=${year}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get payment statistics', 500, 'Failed to get payment statistics');
  }

  // New methods for getting available years
  async getCustomerYears(): Promise<string[]> {
    const response = await this.makeRequest<ApiResponse<string[]>>('/customers/years');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get customer years', 500, 'Failed to get customer years');
  }

  async getPaymentYears(): Promise<string[]> {
    const response = await this.makeRequest<ApiResponse<string[]>>('/payments/years');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get payment years', 500, 'Failed to get payment years');
  }

  // Affiliator methods
  async getAffiliators(page = 1, limit = 10, search = ''): Promise<{ data: Affiliator[]; pagination: any }> {
    const response = await this.makeRequest<ApiResponse<Affiliator[]>>(`/affiliators?page=${page}&limit=${limit}&search=${search}`);
    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || { total: response.data.length, page, limit, pages: 1 }
      };
    }
    throw new AppError(response.message || 'Failed to get affiliators', 500, 'Failed to get affiliators');
  }

  async getAffiliator(uuid: string): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>(`/affiliators/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator', 500, 'Failed to get affiliator');
  }

  async createAffiliator(data: Omit<Affiliator, 'uuid' | 'createdAt'> & { password: string }): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>('/affiliators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to create affiliator', 500, 'Failed to create affiliator');
  }

  async updateAffiliator(uuid: string, data: Partial<Affiliator>): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>(`/affiliators/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to update affiliator', 500, 'Failed to update affiliator');
  }

  async deleteAffiliator(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/affiliators/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new AppError('Failed to delete affiliator', 500, 'Failed to delete affiliator');
    }
  }

  async getAffiliatorSummary(uuid: string): Promise<AffiliatorSummary> {
    const response = await this.makeRequest<ApiResponse<AffiliatorSummary>>(`/affiliators/${uuid}/summary`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator summary', 500, 'Failed to get affiliator summary');
  }

  // Customer methods
  async getCustomersByAffiliator(affiliatorUuid: string, page = 1, limit = 10): Promise<{ data: Customer[]; pagination: any }> {
    const response = await this.makeRequest<ApiResponse<Customer[]>>(`/customers/by-affiliator/${affiliatorUuid}?page=${page}&limit=${limit}`);
    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || { total: response.data.length, page, limit, pages: 1 }
      };
    }
    throw new AppError(response.message || 'Failed to get customers', 500, 'Failed to get customers');
  }

  async getCustomer(uuid: string): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>(`/customers/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get customer', 500, 'Failed to get customer');
  }

  async createCustomer(data: Omit<Customer, 'uuid' | 'createdAt' | 'affiliatorName'>): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to create customer', 500, 'Failed to create customer');
  }

  async updateCustomer(uuid: string, data: Partial<Customer>): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>(`/customers/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to update customer', 500, 'Failed to update customer');
  }

  async deleteCustomer(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/customers/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new AppError('Failed to delete customer', 500, 'Failed to delete customer');
    }
  }

  // Payment methods
  async getPaymentsByAffiliator(affiliatorUuid: string, page = 1, limit = 10): Promise<{ data: Payment[]; pagination: any }> {
    const response = await this.makeRequest<ApiResponse<Payment[]>>(`/payments/by-affiliator/${affiliatorUuid}?page=${page}&limit=${limit}`);
    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || { total: response.data.length, page, limit, pages: 1 }
      };
    }
    throw new AppError(response.message || 'Failed to get payments', 500, 'Failed to get payments');
  }

  async getPayment(uuid: string): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>(`/payments/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get payment', 500, 'Failed to get payment');
  }

  async createPayment(data: Omit<Payment, 'uuid' | 'createdAt' | 'affiliatorName'>): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to create payment', 500, 'Failed to create payment');
  }

  async updatePayment(uuid: string, data: Partial<Payment>): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>(`/payments/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to update payment', 500, 'Failed to update payment');
  }

  async deletePayment(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/payments/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new AppError('Failed to delete payment', 500, 'Failed to delete payment');
    }
  }

  // Affiliator dashboard methods
  async getAffiliatorCustomers(): Promise<Customer[]> {
    const response = await this.makeRequest<ApiResponse<Customer[]>>('/affiliator/customers');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator customers', 500, 'Failed to get affiliator customers');
  }

  async getAffiliatorPayments(): Promise<Payment[]> {
    const response = await this.makeRequest<ApiResponse<Payment[]>>('/affiliator/payments');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator payments', 500, 'Failed to get affiliator payments');
  }

  // File upload methods
  async uploadProofPayment(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/proof-payment`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new AppError(`Upload failed: ${response.status}`, 500, 'Upload failed');
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new AppError(result.message || 'Upload failed', 500, 'Upload failed');
  }

  // Download payment proof with new endpoint
  async downloadPaymentProof(paymentUuid: string): Promise<ArrayBuffer> {
    const url = `${API_BASE_URL}/payment/proof-image/${paymentUuid}/download`;
    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new AppError(`Download failed: ${response.status}`, 500, 'Download failed');
    }

    return await response.arrayBuffer();
  }
}

export const apiService = new ApiService();
