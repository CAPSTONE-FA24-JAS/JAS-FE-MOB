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
      showSuccessMessage(
        response.data.message || "Successfully retrieved lots."
      );
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
      console.log("Received lot details:", response.data);
      showSuccessMessage(
        response.data.message || "Successfully retrieved lot details."
      );
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
