// api.js hoặc api.ts (nếu bạn dùng TypeScript)
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const getValuationById = async (valuationId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/Valuations/getValuationById?valuationId=${valuationId}`,
      {
        params: {
          valuationId: valuationId,
        },
      }
    );

    if (response.data.code === 200 && response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch valuation");
    }
  } catch (error) {
    console.error("Error fetching valuation by ID:", error);
    throw error;
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
      `${API_URL}/api/Jewelrys/VerifyOTPForAuthorizedBySeller?valuationId=${valuationId}&sellerId=${sellerId}&opt=${opt}`,
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
      throw new Error("Failed to fetch valuation");
    }
  } catch (error) {
    console.error("Error fetching valuation by ID:", error);
    throw error;
  }
};