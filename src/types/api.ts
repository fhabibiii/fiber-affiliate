
export interface Affiliator {
  uuid: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  totalCustomers: number;
  createdAt: string;
}

export interface Customer {
  uuid: string;
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  affiliatorUuid: string;
  affiliatorName: string;
  createdAt: string;
}

export interface Payment {
  uuid: string;
  affiliatorUuid: string;
  affiliatorName: string;
  month: string;
  year: number;
  amount: number;
  paymentDate: string;
  proofImage: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
