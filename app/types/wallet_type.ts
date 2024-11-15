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
  balance: number;
  customerDTO: any;
}

export interface CreateWalletResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: {
    balance: number;
    customerDTO: any; // Replace `any` with the actual customer DTO type if available
  };
  errorMessages: string[] | null;
}

// transactions

export interface Transaction {
  transactionType: string;
  amount: number;
  transactionTime: string;
  status: string;
}

export interface TransactionResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: Transaction[];
  errorMessages: string[] | null;
}

export default {};
