import { Response } from "@/app/types/respone_type";
import apiClient from "./config";
import { FinancialProof } from "@/app/types/finance_proof_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const getListFinancialProof = async (
  userId: number = 0
): Promise<Response<FinancialProof>> => {
  try {
    console.log("Bắt đầu gọi API GetListFinancialProof...", userId);
    console.log(
      "API_URL:",
      `${API_URL}/api/BidLimit/ViewAllBidLimitByCustomer?customerId=${userId}`
    );

    const response = await apiClient.get<Response<FinancialProof>>(
      `${API_URL}/api/BidLimit/ViewAllBidLimitByCustomer?customerId=${userId}`
    );

    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Lỗi khi lấy thông tin chứng minh tài chính"
      );
    }
  } catch (error) {
    console.error("Lỗi khi gọi API GetListFinancialProof:", error);
    throw error;
  }
};

export const createFinancialProof = async (
  fileUri: string,
  fileType: string,
  fileName: string,
  CustomerId: number
) => {
  try {
    console.log("Starting CreateFinancialProof API call...", {
      fileUri,
      fileType,
      fileName,
      CustomerId,
    });

    if (!fileUri) {
      throw new Error("File URI is required.");
    }
    const formData = new FormData();

    formData.append("File", {
      uri: fileUri,
      type: fileType,
      name: fileName,
    } as any);

    formData.append("CustomerId", CustomerId.toString());

    console.log("FormData created:", formData);

    const response = await apiClient.post(
      `${API_URL}/api/BidLimit/CreateBidLimit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          return data;
        },
      }
    );

    // console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating financial proof:", error);
    throw error;
  }
};
