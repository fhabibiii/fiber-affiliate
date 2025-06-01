
import { LoginCredentials, AuthResponse, User } from '@/types/auth';

const API_BASE_URL = 'https://14fd-2404-c0-3740-00-a64c-1454.ngrok-free.app/api/v1';

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
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...(options.headers as Record<string, string> || {}),
    };

    console.log('Making API request:', { url, method: options.method || 'GET', headers });

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Important: send cookies with all requests
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);
      
      console.log('API response status:', response.status);

      // Check if response is HTML (ngrok warning page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('Received HTML response instead of JSON');
        throw new Error('Server returned HTML instead of JSON. Please check if the API server is running correctly.');
      }

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized - redirecting to login');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        
        if (response.status === 403) {
          throw new Error('You do not have permission to access this resource');
        }
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || '60';
          throw new Error(`Too many requests. Please try again in ${retryAfter} seconds.`);
        }
        
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        console.error('API error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty response for delete operations (204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true } as T;
      }

      const responseData = await response.json();
      console.log('API response data:', responseData);
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('API request timeout');
        throw new Error('Request timeout. Please check your internet connection.');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Attempting login with credentials:', { username: credentials.username });
    
    try {
      const response = await this.makeRequest<{
        success: boolean;
        user: User;
        message?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('Login response:', response);

      if (response.success) {
        console.log('Login successful');
        return {
          token: '', // No longer needed with cookies
          refreshToken: '', // No longer needed with cookies
          user: response.user
        };
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Admin methods
  async getAdminSummary(): Promise<AdminSummary> {
    const response = await this.makeRequest<ApiResponse<AdminSummary>>('/admin/summary');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get admin summary');
  }

  async getCustomerStats(year: number): Promise<StatItem[]> {
    const response = await this.makeRequest<ApiResponse<StatItem[]>>(`/admin/stats/customers?year=${year}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get customer statistics');
  }

  async getPaymentStats(year: number): Promise<StatItem[]> {
    const response = await this.makeRequest<ApiResponse<StatItem[]>>(`/admin/stats/payments?year=${year}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get payment statistics');
  }

  async getCustomerYears(): Promise<string[]> {
    const response = await this.makeRequest<ApiResponse<string[]>>('/customers/years');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get customer years');
  }

  async getPaymentYears(): Promise<string[]> {
    const response = await this.makeRequest<ApiResponse<string[]>>('/payments/years');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get payment years');
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
    throw new Error(response.message || 'Failed to get affiliators');
  }

  async getAffiliator(uuid: string): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>(`/affiliators/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get affiliator');
  }

  async createAffiliator(data: Omit<Affiliator, 'uuid' | 'createdAt'> & { password: string }): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>('/affiliators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create affiliator');
  }

  async updateAffiliator(uuid: string, data: Partial<Affiliator>): Promise<Affiliator> {
    const response = await this.makeRequest<ApiResponse<Affiliator>>(`/affiliators/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update affiliator');
  }

  async deleteAffiliator(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/affiliators/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new Error('Failed to delete affiliator');
    }
  }

  async getAffiliatorSummary(uuid: string): Promise<AffiliatorSummary> {
    const response = await this.makeRequest<ApiResponse<AffiliatorSummary>>(`/affiliators/${uuid}/summary`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get affiliator summary');
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
    throw new Error(response.message || 'Failed to get customers');
  }

  async getCustomer(uuid: string): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>(`/customers/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get customer');
  }

  async createCustomer(data: Omit<Customer, 'uuid' | 'createdAt' | 'affiliatorName'>): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create customer');
  }

  async updateCustomer(uuid: string, data: Partial<Customer>): Promise<Customer> {
    const response = await this.makeRequest<ApiResponse<Customer>>(`/customers/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update customer');
  }

  async deleteCustomer(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/customers/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new Error('Failed to delete customer');
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
    throw new Error(response.message || 'Failed to get payments');
  }

  async getPayment(uuid: string): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>(`/payments/${uuid}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get payment');
  }

  async createPayment(data: Omit<Payment, 'uuid' | 'createdAt' | 'affiliatorName'>): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create payment');
  }

  async updatePayment(uuid: string, data: Partial<Payment>): Promise<Payment> {
    const response = await this.makeRequest<ApiResponse<Payment>>(`/payments/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update payment');
  }

  async deletePayment(uuid: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean }>(`/payments/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new Error('Failed to delete payment');
    }
  }

  // Affiliator dashboard methods
  async getAffiliatorCustomers(): Promise<Customer[]> {
    const response = await this.makeRequest<ApiResponse<Customer[]>>('/affiliator/customers');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get affiliator customers');
  }

  async getAffiliatorPayments(): Promise<Payment[]> {
    const response = await this.makeRequest<ApiResponse<Payment[]>>('/affiliator/payments');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get affiliator payments');
  }

  // File upload methods
  async uploadProofPayment(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };

    const response = await fetch(`${API_BASE_URL}/upload/proof-payment`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Upload failed');
  }

  // Download payment proof with new endpoint
  async downloadPaymentProof(paymentUuid: string): Promise<ArrayBuffer> {
    const url = `${API_BASE_URL}/payment/proof-image/${paymentUuid}/download`;
    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    return await response.arrayBuffer();
  }
}

export const apiService = new ApiService();
