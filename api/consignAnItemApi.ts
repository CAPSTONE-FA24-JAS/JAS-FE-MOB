import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  HistoryConsignmentResponse,
  TimeLineConsignment,
} from "@/app/types/consign_type";
import { Response } from "@/app/types/respone_type";
import apiClient from "./config";
import { Alert } from "react-native";
import { DocumentPickerAsset } from "expo-document-picker";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const consignAnItem = async (
  sellerId: number,
  name: string,
  height: number,
  width: number,
  depth: number,
  description: string,
  images: string[],
  documents: DocumentPickerAsset[] | null,
  status: number
) => {
  try {
    console.log("consignAnItem", {
      sellerId,
      name,
      height,
      width,
      depth,
      description,
      images,
      documents,
      status,
    });

    const formData = new FormData();

    formData.append("SellerId", sellerId.toString());
    formData.append("Name", name);
    formData.append("Height", height.toString());
    formData.append("Width", width.toString());
    formData.append("Depth", depth.toString());
    formData.append("Description", description);

    images.forEach((imageUri) => {
      const filename = imageUri.split("/").pop();
      formData.append("ImageValuation", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      } as any);
    });

    documents?.forEach((document) => {
      formData.append("DocumentGemstone", {
        uri: document.uri,
        name: document.name,
        type: document.mimeType || "application/octet-stream",
      } as any);
    });

    const response = await axios.post(
      `${API_URL}/api/Valuations/consignAnItem`,
      formData,
      {
        params: {
          Name: name,
          Height: height,
          Width: width,
          Depth: depth,
          Description: description,
          SellerId: sellerId,
          Status: status,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.isSuccess) {
      showSuccessMessage("Item consigned successfully.");
      return response.data;
    } else {
      throw new Error(
        response.data.errorMessages?.join(", ") || response.data.message
      );
    }
  } catch (error: any) {
    const apiErrorMessage =
      error.response?.data?.errorMessages?.join(", ") || error.message;
    Alert.alert(apiErrorMessage);
    throw error;
  }
};

export const getHistoryConsign = async (
  sellerId: number,
  pageSize: number,
  pageIndex: number,
  status?: number // status là tùy chọn
): Promise<HistoryConsignmentResponse | null> => {
  try {
    const params: any = {
      sellerId: sellerId,
      status: status,
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    console.log("params", params);

    if (status !== undefined) {
      params.status = status; // Chỉ thêm status nếu khác undefined
    }

    const response = await axios.get<Response<HistoryConsignmentResponse>>(
      `${API_URL}/api/Valuations/getPreliminaryValuationByStatusOfSeller?sellerId=${sellerId}`,
      { params }
    );
    console.log(
      `${API_URL}/api/Valuations/getPreliminaryValuationByStatusOfSeller?sellerId=${sellerId}`
    );

    if (response.data.isSuccess) {
      if (response.data.data === null) {
        console.log("No consign items available for this status.");
        return null; // Return null or handle it appropriately
      }

      // console.log("Lịch sử ký gửi:", response.data);
      showSuccessMessage(response.data.message || "Đã lấy lịch sử");
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Lỗi khi lấy lịch sử ký gửi.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử ký gửi:", error);
    showErrorMessage("Không thể lấy lịch sử ký gửi.");
    throw error;
  }
};

// Hàm cập nhật trạng thái của một ký gửi
export const updateStatusForValuation = async (id: number, status: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/Valuations/UpdateStatusForValuations`,
      null, // PUT không cần body trong trường hợp này
      {
        params: {
          id: id,
          status: status,
        },
      }
    );

    if (response.data.isSuccess) {
      console.log("Cập nhật trạng thái thành công:", response.data);
      showSuccessMessage("Cập nhật trạng thái thành công.");
      return response.data;
    } else {
      throw new Error(response.data.message || "Lỗi khi cập nhật trạng thái.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    showErrorMessage("Không thể cập nhật trạng thái.");
    throw error;
  }
};

// Function to fetch detailed history for a specific valuation
export const getDetailHistoryValuation = async (
  valuationId: number
): Promise<TimeLineConsignment[]> => {
  try {
    const response = await apiClient.get<Response<TimeLineConsignment[]>>(
      `/api/Valuations/getDetailHistoryValuation?valuationId=${valuationId}`
    );
    console.log("valuationId", valuationId);

    if (response.data.isSuccess) {
      showSuccessMessage("Fetched valuation history successfully.");
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch valuation history."
      );
    }
  } catch (error) {
    console.error("Error fetching valuation history:", error);
    showErrorMessage("Unable to fetch valuation history.");
    return [];
  }
};

export const rejectForValuations = async (
  id: number,
  status: number,
  reason: string
): Promise<any> => {
  console.log("Rejecting valuation:", { id, status, reason });

  try {
    const response = await axios.put(
      `${API_URL}/api/Valuations/RejectForValuations`,
      null, // Không cần body trong PUT nếu sử dụng query parameters
      {
        params: {
          id, // ID của định giá
          status, // Trạng thái cần cập nhật
          reason, // Lý do hủy
        },
      }
    );

    if (response.data.isSuccess) {
      console.log("Reject valuation successfully:", response.data);
      showSuccessMessage(
        response.data.message || "Cập nhật trạng thái thành công."
      );
      return response.data;
    } else {
      throw new Error(response.data.message || "Lỗi khi cập nhật trạng thái.");
    }
  } catch (error) {
    console.error("Error rejecting valuation:", error);
    showErrorMessage("Không thể hủy định giá.");
    throw error;
  }
};

export const rejectJewelryByOwner = async (
  jewelryId: number,
  status: number,
  reason: string
): Promise<any> => {
  console.log("Rejecting jewelry by owner:", { jewelryId, status, reason });

  try {
    const response = await axios.put(
      `${API_URL}/api/Jewelrys/RejectByOwner`,
      null, // No body required for this PUT request
      {
        params: {
          jewelryId, // ID of the jewelry item
          status, // Status to update
          reason, // Reason for rejection
        },
        headers: {
          "Content-Type": "application/json", // Ensure proper headers
        },
      }
    );

    if (response.data.isSuccess) {
      console.log("Jewelry rejected successfully:", response.data);
      showSuccessMessage(
        response.data.message || "Jewelry rejection completed successfully."
      );
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to reject jewelry.");
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error occurred while rejecting jewelry.";
    console.error("Error rejecting jewelry:", error);
    showErrorMessage(errorMessage);
    throw error;
  }
};
