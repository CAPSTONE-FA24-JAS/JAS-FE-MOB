import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import apiClient from "./config";
import { ApiResponse } from "./utils/ApiError";
import { WatchingResponse } from "@/app/types/watching_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to get list of all watchings by customer ID
export const getAllWatchingsByCustomerId = async (
  customerId: number
): Promise<WatchingResponse> => {
  try {
    const response = await axios.get<WatchingResponse>(
      `${API_URL}/api/Watching/ViewAllWatchingOfCustomer`,
      { params: { customerId } }
    );

    if (response.data.isSuccess) {
      console.log("Received list of watchings:", response.data);
      showSuccessMessage(
        response.data.message || "Successfully retrieved watchings."
      );
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve watchings.");
    }
  } catch (error) {
    console.error("Error retrieving watchings:", error);
    showErrorMessage("Unable to retrieve list of watchings.");
    throw error;
  }
};

// Function to add a new watching for a customer
export const addNewWatchingForCustomer = async (
  customerId: number,
  jewelryId: number
): Promise<ApiResponse | null> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${API_URL}/api/Watching/AddNewWatchingForCustomer`,
      { customerId, jewelryId }
    );

    if (response.data.isSuccess) {
      console.log("Watching added successfully:", response.data);
      showSuccessMessage(
        response.data.message || "Watching added successfully."
      );
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add watching.");
    }
  } catch (error) {
    console.error("Error adding new watching:", error);
    showErrorMessage("Unable to add new watching.");
    throw error;
  }
};

// Function to remove a watching by watching ID
export const removeWatching = async (
  watchingId: number
): Promise<ApiResponse | null> => {
  try {
    const response = await axios.delete<ApiResponse>(
      `${API_URL}/api/Watching/RemoveWatching`,
      { params: { watchingId } }
    );

    if (response.data.isSuccess) {
      console.log("Watching removed successfully:", response.data);
      showSuccessMessage(
        response.data.message || "Watching removed successfully."
      );
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to remove watching.");
    }
  } catch (error) {
    console.error("Error removing watching:", error);
    showErrorMessage("Unable to remove watching.");
    throw error;
  }
};
