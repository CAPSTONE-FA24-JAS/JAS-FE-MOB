import { WalletDto } from "./profilte_type";

// Type definitions for the responses
export interface WalletBalanceResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: WalletDto;
  errorMessages: any;
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

export interface Withdraws {
  id: number;
  customerId: number;
  walletId: number;
  status: string;
  amount: number;
  viewCreditCardDTO: {
    id: number;
    bankName: string;
    bankAccountHolder: string;
    bankCode: string;
    customerId: number;
  };
}

export default {};
