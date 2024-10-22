import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  CreateWalletResponse,
  WalletBalanceResponse,
} from "@/app/types/wallet_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

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

// Function to create a new wallet for a customer by customer ID
export const createWallet = async (
  customerId: number
): Promise<CreateWalletResponse | null> => {
  try {
    const response = await axios.post<CreateWalletResponse>(
      `${API_URL}/api/Wallet/CreateWallet`,
      { customerId }
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
  walletId: number,
  amount: number
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/Wallet/TopUp`, {
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
