// Type definitions for the responses
export interface WalletBalanceResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: DataBalance;
  errorMessages: any;
}

export interface DataBalance {
  id: number;
  balance: string;
  customerDTO: any;
}

export interface CreateWalletResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: {
    balance: string;
    customerDTO: any; // Replace `any` with the actual customer DTO type if available
  };
  errorMessages: string[] | null;
}
