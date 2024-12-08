// api.js hoặc api.ts (nếu bạn dùng TypeScript)
import { DataConsignDetail } from "@/app/types/consign_detail_type";
import { dataResponseConsignList } from "@/app/types/consign_type";
import { Response } from "@/app/types/respone_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import axios from "axios";
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to fetch valuation details for a specific valuation ID
export const getValuationById = async (
  valuationId: number
): Promise<DataConsignDetail | null> => {
  try {
    const response = await apiClient.get<Response<DataConsignDetail>>(
      `/api/Valuations/getValuationById?valuationId=${valuationId}`
    );
    console.log("valuationId", valuationId);

    if (response.data.isSuccess) {
      showSuccessMessage("Fetched valuation details successfully.");
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch valuation details."
      );
    }
  } catch (error) {
    console.error("Error fetching valuation details:", error);
    showErrorMessage("Unable to fetch valuation details.");
    return null;
  }
};

export const requestOTPMail = async (valuationId: number, sellerId: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/Jewelrys/RequestOTPForAuthorizedBySeller?valuationId=${valuationId}&sellerId=${sellerId}`,
      {
        params: {
          valuationId: valuationId,
          sellerId: sellerId,
        },
      }
    );

    if (response.data.isSuccess) {
      return response.data.message;
    } else {
      throw new Error("Failed to fetch valuation");
    }
  } catch (error) {
    console.error("Error fetching valuation by ID:", error);
    throw error;
  }
};

export const checkOTP = async (
  valuationId: number,
  sellerId: number,
  opt: string
) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/Jewelrys/VerifyOTPForAuthorizedBySeller`,
      {}, // PUT request thường có body, nếu không cần gửi dữ liệu, gửi {} hoặc null
      {
        params: {
          valuationId: valuationId,
          sellerId: sellerId,
          opt: opt,
        },
      }
    );

    if (response.data.isSuccess) {
      return response.data;
    } else {
      // Xử lý khi isSuccess là false
      showErrorMessage("OTP không hợp lệ. Vui lòng thử lại.");
      throw new Error("Failed to verify OTP");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 400) {
          // Hiển thị toast khi lỗi là 400
          showErrorMessage("OTP sai. Vui lòng kiểm tra và thử lại.");
        } else {
          // Xử lý các lỗi khác
          showErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else if (error.request) {
        // Xử lý khi không nhận được phản hồi từ server
        showErrorMessage(
          "Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối."
        );
      } else {
        // Xử lý các lỗi khác
        showErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } else {
      // Xử lý các lỗi không phải là AxiosError
      showErrorMessage("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
    }
    console.error("Error fetching valuation by ID:", error);
    throw error;
  }
};
