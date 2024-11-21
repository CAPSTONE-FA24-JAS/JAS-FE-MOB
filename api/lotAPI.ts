import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import apiClient from "./config";
import { ListLotResponse, LotDetailResponse } from "@/app/types/lot_type";
import { ApiError, ApiResponse } from "./utils/ApiError";
import { Response } from "@/app/types/respone_type";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to get list of lots by auction ID
export const getLotsByAuctionId = async (
  auctionId: number
): Promise<ListLotResponse | null> => {
  try {
    const response = await axios.get<ListLotResponse>(
      `${API_URL}/api/Lot/ViewListLotByAuction`,
      { params: { auctionId } }
    );

    if (response.data.isSuccess) {
      console.log("Received list of lots:", response.data);
      // showSuccessMessage(
      //   response.data.message || "Successfully retrieved lots."
      // );
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve lots.");
    }
  } catch (error) {
    console.error("Error retrieving lots:", error);
    showErrorMessage("Unable to retrieve list of lots.");
    throw error;
  }
};

// Function to get lot detail by lot ID
export const getLotDetailById = async (
  lotId: number
): Promise<LotDetailResponse | null> => {
  try {
    const response = await axios.get<LotDetailResponse>(
      `${API_URL}/api/Lot/ViewDetailLotById`,
      { params: { Id: lotId } }
    );

    if (response.data.isSuccess) {
      // console.log("Received lot details:", response.data);
      // showSuccessMessage(
      //   response.data.message || "Successfully retrieved lot details."
      // );
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve lot details."
      );
    }
  } catch (error) {
    console.error("Error retrieving lot details:", error);
    showErrorMessage("Unable to retrieve lot details.");
    throw error;
  }
};

// Function to register to bid for a lot
export const registerToBid = async (
  currentPrice: number,
  customerId: number,
  lotId: number
): Promise<void> => {
  console.log("Registering to bid...", currentPrice, customerId, lotId);

  try {
    const response = await axios.post<ApiResponse>(
      `${API_URL}/api/Lot/RegisterToBid`,
      {
        currentPrice,
        customerId,
        lotId,
      }
    );
    if (response.data.isSuccess) {
      console.log("Register to bid success:", response.data);
      showSuccessMessage(
        response.data.message || "Register customer to lot successfully."
      );
    } else {
      Alert.alert("Thông báo", response.data.message);
      // Throw ApiError with specific code and message from the API
      const { code, message } = response.data;
      throw new Error(message || "Failed to register to bid.");
    }
  } catch (error: any) {
    console.error("Error registering to bid:", error);
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      throw new ApiError(
        code || 500,
        message || "Unable to register customer to lot."
      );
    } else if (error instanceof ApiError) {
      // Re-throw ApiError instances
      throw error;
    } else {
      // For other types of errors (e.g., network errors)
      showErrorMessage("Unable to register customer to lot.");
      throw new ApiError(500, "Unable to register customer to lot.");
    }
  }
};

// Function to check if a customer is in a lot
export const checkCustomerInLot = async (
  customerId: number,
  lotId: number
): Promise<{
  customerId: number;
  lotId: number;
  customerLotId: number;
  result: boolean;
} | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/Lot/CheckCustomerInLot`, {
      params: { customerId, lotId },
    });

    if (response.data.isSuccess && response.data.data) {
      console.log("Customer is in the lot:", response.data.data);
      // Return the full data object if the customer is in the lot
      return response.data.data;
    } else {
      console.log("Customer is not in the lot.");
      return null;
    }
  } catch (error) {
    console.error("Error checking customer in lot:", error);
    showErrorMessage("Unable to check customer's participation in the lot.");
    throw error;
  }
};

// Function to check if the customer has bid on a specific lot
export const checkCustomerHaveBidPrice = async (
  customerId: number,
  lotId: number
): Promise<ApiResponse | null> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${API_URL}/api/Lot/CheckCustomerHaveBidPrice`,
      {
        customerId,
        lotId,
      }
    );

    console.log("Check customer's bid status response:", response.data);

    if (response.data.isSuccess && response.data.data) {
      console.log("Customer has bid on the lot:", response.data.data);
      // showSuccessMessage(
      //   response.data.message || "The customer is auctioned into the lot."
      // );
      return response.data;
    } else {
      console.log("Customer hasn't bid on the lot.");
      // showErrorMessage(
      //   response.data.message || "The customer hasn't bid to the lot."
      // );
      return null;
    }
  } catch (error: any) {
    console.error("Error checking customer's bid status:", error);
    // showErrorMessage("Unable to check if the customer has bid on the lot.");
    throw new ApiError(
      error.response?.data?.code || 500,
      error.response?.data?.message || "Error checking bid status."
    );
  }
};

// Function to set auto-bid configuration
export const setAutoBidConfig = async (
  minPrice: number,
  maxPrice: number,
  numberOfPriceStep: number,
  timeIncrement: number,
  customerLotId: number
): Promise<void> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${API_URL}/api/CustomerLots/SetAutoBid`,
      {
        minPrice,
        maxPrice,
        numberOfPriceStep,
        timeIncrement,
        customerLotId,
      }
    );

    if (response.data.isSuccess) {
      console.log("Set auto-bid configuration successfully:", response.data);
      showSuccessMessage(
        response.data.message || "Auto-bid configuration set successfully."
      );
    } else {
      throw new Error(
        response.data.message || "Failed to set auto-bid configuration."
      );
    }
  } catch (error: any) {
    console.error("Error setting auto-bid configuration:", error);
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      throw new ApiError(
        code || 500,
        message || "Unable to set auto-bid configuration."
      );
    } else if (error instanceof ApiError) {
      throw error;
    } else {
      showErrorMessage("Unable to set auto-bid configuration.");
      throw new ApiError(500, "Unable to set auto-bid configuration.");
    }
  }
};

// Function to get the total number of customers in a fixed price lot
export const getTotalCustomerInLotFixedPrice = async (
  lotId: number
): Promise<number | null> => {
  try {
    const response = await axios.get<Response<number>>(
      `${API_URL}/api/Lot/TotalCustomerInLotFixedPrice`,
      {
        params: { lotId },
      }
    );

    if (response.data.isSuccess && response.data.data !== null) {
      console.log("Total customers in lot (fixed price):", response.data.data);
      return response.data.data; // Trả về số lượng khách hàng
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve total customers."
      );
    }
  } catch (error) {
    console.error(
      "Error retrieving total customers in lot (fixed price):",
      error
    );
    showErrorMessage("Unable to retrieve total customers in the lot.");
    throw error;
  }
};

// Function to get floor fees
export const getFloorFees = async (): Promise<
  | {
      from: number | null;
      to: number | null;
      percent: number;
      id: number;
    }[]
  | null
> => {
  try {
    const response = await axios.get<{
      code: number;
      message: string;
      isSuccess: boolean;
      data: {
        from: number | null;
        to: number | null;
        percent: number;
        id: number;
      }[];
    }>(`${API_URL}/api/FloorFeePercents/GetFloorFees`);

    if (response.data.isSuccess && response.data.data) {
      console.log("Received floor fees:", response.data.data);
      showSuccessMessage(
        response.data.message || "Floor fees retrieved successfully."
      );
      return response.data.data; // Return the array of floor fees
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve floor fees."
      );
    }
  } catch (error: any) {
    console.error("Error retrieving floor fees:", error);
    showErrorMessage("Unable to retrieve floor fees.");
    throw new ApiError(
      error.response?.data?.code || 500,
      error.response?.data?.message || "Error retrieving floor fees."
    );
  }
};
