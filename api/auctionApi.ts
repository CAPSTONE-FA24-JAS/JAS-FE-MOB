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

export const viewAuctions = async (): Promise<ViewAutionsReponse> => {
  try {
    const response = await axios.get<ViewAutionsReponse>(
      `${API_URL}/api/Auction/ViewAutions`
    );

    if (response.data.isSuccess) {
      // Nếu thành công, bạn có thể hiển thị thông báo nếu cần
      showSuccessMessage(
        response.data.message || "Auctions retrieved successfully!"
      );
      return response.data;
    } else {
      // Nếu API trả về isSuccess = false, hiển thị lỗi từ server
      showErrorMessage(response.data.message || "Failed to retrieve auctions.");
      throw new Error(response.data.message || "Failed to retrieve auctions.");
    }
  } catch (error: any) {
    // Nếu có lỗi khác (ví dụ: network error)
    console.error("Error fetching auctions:", error);

    // Kiểm tra lỗi có response từ server hay không
    const errorMessage =
      error.response?.data?.message || "Unable to fetch auctions.";
    showErrorMessage(errorMessage);

    // Ném lỗi để xử lý tiếp ở chỗ gọi hàm
    throw new Error(errorMessage);
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
      showSuccessMessage(
        response.data.message || "Auctions retrieved successfully by status!"
      );
      return response.data;
    } else {
      showErrorMessage(
        response.data.message || "Failed to retrieve auctions by status."
      );
      throw new Error(
        response.data.message || "Failed to retrieve auctions by status."
      );
    }
  } catch (error: any) {
    console.error(`Error fetching auctions with status ${statusId}:`, error);

    const errorMessage =
      error.response?.data?.message || "Unable to fetch auctions by status.";
    showErrorMessage(errorMessage);
    throw new Error(errorMessage);
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
      showSuccessMessage(
        response.data.message || "Auction details retrieved successfully!"
      );
      return response.data;
    } else {
      showErrorMessage(
        response.data.message || "Failed to retrieve auction details."
      );
      throw new Error(
        response.data.message || "Failed to retrieve auction details."
      );
    }
  } catch (error: any) {
    console.error("Error fetching auction details:", error);

    const errorMessage =
      error.response?.data?.message || "Unable to fetch auction details.";
    showErrorMessage(errorMessage);
    throw new Error(errorMessage);
  }
};
