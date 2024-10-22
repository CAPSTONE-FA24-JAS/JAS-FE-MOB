import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  AuctionStatus,
  ViewAutionIdReponse,
  ViewAutionsReponse,
} from "@/app/types/auction_type";

// Define the base API URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to fetch all auctions
export const viewAuctions = async (): Promise<ViewAutionsReponse> => {
  try {
    const response = await axios.get<ViewAutionsReponse>(
      `${API_URL}/api/Auction/ViewAutions`
    );

    if (response.data.isSuccess) {
      // Optionally, you can display a success message
      // showSuccessMessage(response.data.message);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve auctions.");
    }
  } catch (error) {
    console.error("Error fetching auctions:", error);
    showErrorMessage("Unable to fetch auctions.");
    throw error;
  }
};

// Function to fetch auctions by status
export const getAuctionsByStatus = async (
  statusId: AuctionStatus
): Promise<ViewAutionsReponse> => {
  try {
    const response = await axios.get<ViewAutionsReponse>(
      `${API_URL}/api/Auction/GetAuctionsByStatus`,
      {
        params: { statusId },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received auctions by status:", response.data);

      // Optionally, you can display a success message
      // showSuccessMessage(response.data.message);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve auctions by status."
      );
    }
  } catch (error) {
    console.error(`Error fetching auctions with status ${statusId}:`, error);
    showErrorMessage("Unable to fetch auctions by status.");
    throw error;
  }
};

// Hàm gọi API để lấy chi tiết đấu giá theo Id
export const viewAuctionById = async (
  auctionId: number
): Promise<ViewAutionIdReponse> => {
  try {
    const response = await axios.get<ViewAutionIdReponse>(
      `${API_URL}/api/Auction/ViewAutionById`,
      {
        params: { Id: auctionId },
      }
    );

    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve auction details."
      );
    }
  } catch (error) {
    console.error("Error fetching auction details:", error);
    throw error;
  }
};
