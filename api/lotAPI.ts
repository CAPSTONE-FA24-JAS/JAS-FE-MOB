import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import apiClient from "./config";
import { ListLotResponse, LotDetailResponse } from "@/app/types/lot_type";

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
    const response = await apiClient.post(`${API_URL}/api/Lot/RegisterToBid`, {
      currentPrice,
      customerId,
      lotId,
    });

    if (response.data.isSuccess) {
      console.log("Register to bid success:", response.data);
      showSuccessMessage(
        response.data.message || "Register customer to lot successfully."
      );
    } else {
      throw new Error(
        response.data.message || "Failed to register customer to lot."
      );
    }
  } catch (error) {
    console.error("Error registering to bid:", error);
    showErrorMessage("Unable to register customer to lot.");
    throw error;
  }
};

// Function to check if a customer is in a lot
export const checkCustomerInLot = async (
  customerId: number,
  lotId: number
): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/api/Lot/CheckCustomerInLot`, {
      params: { customerId, lotId },
    });

    if (response.data.isSuccess && response.data.data) {
      console.log("Customer is in the lot.");
      // showSuccessMessage(
      //   response.data.message || "Customer was joined to lot."
      // );
      return true;
    } else {
      console.log("Customer is not in the lot.");
      // showErrorMessage(
      //   response.data.message || "Customer hasn't joined the lot."
      // );
      return false;
    }
  } catch (error) {
    console.error("Error checking customer in lot:", error);
    showErrorMessage("Unable to check customer's participation in the lot.");
    throw error;
  }
};
