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
    const response = await axios.get<WalletBalanceResponse>(
      `${API_URL}/api/Wallet/CheckBalance`,
      { params: { walletId } }
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
