import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  CreateWalletResponse,
  TransactionResponse,
  WalletBalanceResponse,
  Withdraws,
} from "@/app/types/wallet_type";
import { Response } from "@/app/types/respone_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to check if the wallet password is correct
export const checkPasswordWallet = async (
  walletId: number,
  password: string
): Promise<boolean> => {
  console.log("checking wallet password:", walletId, password);

  try {
    console.log("Checking wallet password...");
    console.log("Wallet ID:", walletId);
    console.log("Password:", password);

    const response = await axios.get(
      `${API_URL}/api/Wallet/CheckPasswordWallet`,
      {
        params: { walletId, password },
      }
    );

    if (response.data.isSuccess) {
      console.log("Password is correct:", response.data.message);
      showSuccessMessage("Password verified successfully.");
      return true;
    } else {
      console.warn("Password verification failed:", response.data.message);
      showErrorMessage(response.data.message || "Incorrect wallet password.");
      return false;
    }
  } catch (error) {
    console.error("Error checking wallet password:", error);
    showErrorMessage("Unable to verify wallet password.");
    throw error;
  }
};

// Function to check wallet balance by wallet ID
export const checkWalletBalance = async (
  walletId: number
): Promise<WalletBalanceResponse | null> => {
  try {
    console.log("Checking wallet balance...");
    console.log("Wallet ID:", walletId);

    const response = await axios.get<WalletBalanceResponse>(
      `${API_URL}/api/Wallet/CheckBalance?walletId=${walletId}`
    );

    if (response.data.isSuccess) {
      console.log("Wallet balance retrieved:", response.data.data.balance);
      showSuccessMessage("Wallet balance retrieved successfully.");
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve wallet balance."
      );
    }
  } catch (error) {
    console.error("Error checking wallet balance:", error);
    showErrorMessage("Unable to retrieve wallet balance.");
    throw error;
  }
};

// Function to create a new wallet for a customer with a password
export const createWallet = async (
  customerId: number,
  password: string
): Promise<CreateWalletResponse | null> => {
  try {
    const response = await axios.post<CreateWalletResponse>(
      `${API_URL}/api/Wallet/CreateWallet`,
      {
        customerId,
        password,
      }
    );

    if (response.data.isSuccess) {
      console.log("Wallet created successfully:", response.data);
      showSuccessMessage(
        response.data.message || "Wallet created successfully."
      );
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create wallet.");
    }
  } catch (error) {
    console.error("Error creating wallet:", error);
    showErrorMessage("Unable to create wallet.");
    throw error;
  }
};

// Function to top up the wallet
export const depositWallet = async (
  customerId: number,
  walletId: number,
  amount: number
): Promise<string> => {
  try {
    console.log("Depositing to wallet:", customerId, walletId, amount);

    const response = await axios.post(`${API_URL}/api/Wallet/TopUp`, {
      customerId,
      walletId,
      amount,
    });

    if (response.status === 200 && response.data) {
      const paymentLink = response.data; // Assume response contains the payment link as a plain string
      console.log("Payment link:", paymentLink);
      return paymentLink;
    } else {
      throw new Error("Failed to top up wallet.");
    }
  } catch (error) {
    console.error("Error topping up wallet:", error);
    showErrorMessage("Unable to top up wallet.");
    throw error;
  }
};

// Function to get transactions by customer ID
export const getTransactionsByCustomer = async (
  customerId: number
): Promise<TransactionResponse | null> => {
  try {
    console.log("Fetching transactions for customer ID:", customerId);

    const response = await axios.get<TransactionResponse>(
      `${API_URL}/api/Transaction/ViewTransactionsByCustomer`,
      {
        params: { customerId },
      }
    );

    if (response.data.isSuccess) {
      console.log("Transactions retrieved successfully:", response.data.data);
      showSuccessMessage(
        response.data.message || "Transactions retrieved successfully."
      );
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve transactions."
      );
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    showErrorMessage("Unable to retrieve transactions.");
    throw error;
  }
};

export const RequestNewWithdraw = async (
  customerId: number,
  walletId: number,
  amount: number
): Promise<Response<string | null>> => {
  try {
    console.log(
      "Requesting withdraw for wallet:",
      customerId,
      walletId,
      amount
    );

    const response = await axios.post<Response<string | null>>(
      `${API_URL}/api/Wallet/RequestNewWithdraw`,
      {
        customerId,
        walletId,
        amount,
      }
    );

    if (response.data.code === 200 && response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error("Failed to request withdraw.");
    }
  } catch (error) {
    console.error("Error requesting withdraw:", error);
    showErrorMessage("Unable to request withdraw.");
    throw error;
  }
};

export const getAllWithdraws = async (
  customerId: number
): Promise<Withdraws[] | null> => {
  try {
    console.log("Fetching withdraws for customer ID:", customerId);

    const response = await axios.get<Response<Withdraws[] | null>>(
      `${API_URL}/api/Wallet/ViewListRequestWithdrawForCustomer?customerId=${customerId}`,
      {
        params: { customerId },
      }
    );

    if (response.data.code === 200 && response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error("Failed to retrieve withdraws.");
    }
  } catch (error) {
    console.error("Error fetching withdraws:", error);
    showErrorMessage("Unable to retrieve withdraws.");
    throw error;
  }
};
export const cancelWithdraw = async (
  withdrawId: number,
  customerId: number
): Promise<Response<string | null>> => {
  try {
    console.log("Cancelling withdraw:", withdrawId);

    const response = await axios.post<Response<string | null>>(
      `${API_URL}/api/Wallet/CancelRequestNewWithdrawByCustomer?customerId=${customerId}&requestId=${withdrawId}`
    );

    if (response.data.code === 200 && response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error("Failed to cancel withdraw.");
    }
  } catch (error) {
    console.error("Error cancelling withdraw:", error);
    showErrorMessage("Unable to cancel withdraw.");
    throw error;
  }
};
