
export interface User {
  uuid: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  role: 'ADMIN' | 'AFFILIATOR';
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string; // Keep for compatibility, but will be empty string
  refreshToken: string; // Keep for compatibility, but will be empty string
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}
