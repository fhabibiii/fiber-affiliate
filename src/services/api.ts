import { LoginCredentials, AuthResponse, User } from '@/types/auth';
import { APP_CONFIG } from '@/config/environment';
import { logger } from '@/utils/logger';
import { sanitizeError, AppError } from '@/utils/errorHandler';

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
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${APP_CONFIG.API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...(options.headers as Record<string, string> || {}),
    };

    logger.log('Making API request:', { url, method: options.method || 'GET' });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include',
        cache: 'no-store',
      });

      clearTimeout(timeoutId);
      
      logger.log('API response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        logger.error('Received HTML response instead of JSON');
        throw new AppError(
          'Server returned HTML instead of JSON',
          'Server tidak tersedia. Silakan coba lagi nanti.'
        );
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        logger.error('API error response:', errorData);
        
        const sanitized = sanitizeError({
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status
        });
        
        throw new AppError(sanitized.message, sanitized.userMessage, response.status);
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true } as T;
      }

      const responseData = await response.json();
      logger.log('API response received successfully');
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        logger.error('API request timeout');
        throw new AppError('Request timeout', 'Koneksi timeout. Periksa koneksi internet Anda.');
      }
      logger.error('API request failed:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      const sanitized = sanitizeError(error);
      throw new AppError(sanitized.message, sanitized.userMessage);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    logger.log('Attempting login');
    
    try {
      const response = await this.makeRequest<{
        success: boolean;
        user: User;
        message?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      logger.log('Login successful');

      if (response.success) {
        return {
          user: response.user
        };
      }

      throw new AppError(response.message || 'Login failed', 'Login gagal. Periksa username dan password Anda.');
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
      logger.log('Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  async getAdminSummary(): Promise<AdminSummary> {
    const response = await this.makeRequest<ApiResponse<AdminSummary>>('/admin/summary');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get admin summary', 'Gagal memuat ringkasan admin');
  }

  async getCustomerStats(year: number): Promise<StatItem[]> {
    const response = await this.makeRequest<ApiResponse<StatItem[]>>(`/admin/stats/customers?year=${year}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get customer statistics', 'Gagal memuat statistik pelanggan');
  }

  async getPaymentStats(year: number): Promise<StatItem[]> {
    const response = await this.makeRequest<ApiResponse<StatItem[]>>(`/admin/stats/payments?year=${year}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get payment statistics', 'Gagal memuat statistik pembayaran');
  }

  async getCustomerYears(): Promise<string[]> {
    const response = await this.makeRequest<ApiResponse<string[]>>('/customers/years');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get customer years', 'Gagal memuat tahun pelanggan');
  }

  async getPaymentYears(): Promise<string[]> {
    const response = await this.makeRequest<ApiResponse<string[]>>('/payments/years');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get payment years', 'Gagal memuat tahun pembayaran');
  }

  async getAffiliators(page = 1, limit = 10, search = ''): Promise<{ data: Affiliator[]; pagination: any }> {
    const response = await this.makeRequest<ApiResponse<Affiliator[]>>(`/affiliators?page=${page}&limit=${limit}&search=${search}`);
    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || { total: response.data.length, page, limit, pages: 1 }
      };
    }
    throw new AppError(response.message || 'Failed to get affiliators', 'Gagal memuat data afiliator');
  }

  async getAffiliator(uuid: string): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>(`/affiliators/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator', 'Gagal memuat data afiliator');
  }

  async createAffiliator(data: Omit<Affiliator, 'uuid' | 'createdAt'> & { password: string }): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>('/affiliators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to create affiliator', 'Gagal membuat afiliator baru');
  }

  async updateAffiliator(uuid: string, data: Partial<Affiliator>): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>(`/affiliators/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to update affiliator', 'Gagal memperbarui data afiliator');
  }

  async deleteAffiliator(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/affiliators/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new AppError('Failed to delete affiliator', 'Gagal menghapus afiliator');
    }
  }

  async getAffiliatorSummary(uuid: string): Promise<AffiliatorSummary> {
    const response = await this.makeRequest<ApiResponse<AffiliatorSummary>>(`/affiliators/${uuid}/summary`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator summary', 'Gagal memuat ringkasan afiliator');
  }

  async getCustomersByAffiliator(affiliatorUuid: string, page = 1, limit = 10): Promise<{ data: Customer[]; pagination: any }> {
    const response = await this.makeRequest<ApiResponse<Customer[]>>(`/customers/by-affiliator/${affiliatorUuid}?page=${page}&limit=${limit}`);
    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || { total: response.data.length, page, limit, pages: 1 }
      };
    }
    throw new AppError(response.message || 'Failed to get customers', 'Gagal memuat data pelanggan');
  }

  async getCustomer(uuid: string): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>(`/customers/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get customer', 'Gagal memuat data pelanggan');
  }

  async createCustomer(data: Omit<Customer, 'uuid' | 'createdAt' | 'affiliatorName'>): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to create customer', 'Gagal membuat pelanggan baru');
  }

  async updateCustomer(uuid: string, data: Partial<Customer>): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>(`/customers/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to update customer', 'Gagal memperbarui data pelanggan');
  }

  async deleteCustomer(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/customers/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new AppError('Failed to delete customer', 'Gagal menghapus pelanggan');
    }
  }

  async getPaymentsByAffiliator(affiliatorUuid: string, page = 1, limit = 10): Promise<{ data: Payment[]; pagination: any }> {
    const response = await this.makeRequest<ApiResponse<Payment[]>>(`/payments/by-affiliator/${affiliatorUuid}?page=${page}&limit=${limit}`);
    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || { total: response.data.length, page, limit, pages: 1 }
      };
    }
    throw new AppError(response.message || 'Failed to get payments', 'Gagal memuat data pembayaran');
  }

  async getPayment(uuid: string): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>(`/payments/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get payment', 'Gagal memuat data pembayaran');
  }

  async createPayment(data: Omit<Payment, 'uuid' | 'createdAt' | 'affiliatorName'>): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to create payment', 'Gagal membuat pembayaran baru');
  }

  async updatePayment(uuid: string, data: Partial<Payment>): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>(`/payments/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to update payment', 'Gagal memperbarui data pembayaran');
  }

  async deletePayment(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/payments/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new AppError('Failed to delete payment', 'Gagal menghapus pembayaran');
    }
  }

  async getAffiliatorCustomers(): Promise<Customer[]> {
    const response = await this.makeRequest<ApiResponse<Customer[]>>('/affiliator/customers');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator customers', 'Gagal memuat data pelanggan afiliator');
  }

  async getAffiliatorPayments(): Promise<Payment[]> {
    const response = await this.makeRequest<ApiResponse<Payment[]>>('/affiliator/payments');
    if (response.success && response.data) {
      return response.data;
    }
    throw new AppError(response.message || 'Failed to get affiliator payments', 'Gagal memuat data pembayaran afiliator');
  }

  async uploadProofPayment(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };

    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/upload/proof-payment`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new AppError(`Upload failed: ${response.status}`, 'Gagal mengupload file');
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new AppError(result.message || 'Upload failed', 'Gagal mengupload file');
  }

  async downloadPaymentProof(paymentUuid: string): Promise<ArrayBuffer> {
    const url = `${APP_CONFIG.API_BASE_URL}/payment/proof-image/${paymentUuid}/download`;
    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new AppError(`Download failed: ${response.status}`, 'Gagal mendownload file');
    }

    return await response.arrayBuffer();
  }
}

export const apiService = new ApiService();
