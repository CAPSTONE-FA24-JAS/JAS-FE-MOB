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

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const consignAnItem = async (
  sellerId: number,
  name: string,
  height: number,
  width: number,
  depth: number,
  description: string,
  images: string[],
  status: number
) => {
  try {
    const formData = new FormData();

    formData.append("SellerId", sellerId.toString());
    formData.append("Name", name);
    formData.append("Height", height.toString());
    formData.append("Width", width.toString());
    formData.append("Depth", depth.toString());
    formData.append("Description", description);

    // Thêm các hình ảnh vào FormData
    images.forEach((imageUri) => {
      const filename = imageUri.split("/").pop();
      const type = "image/jpeg"; // Bạn có thể thay đổi nếu cần thiết
      formData.append("ImageValuation", {
        uri: imageUri,
        name: filename,
        type: type,
      } as any); // Chuyển uri trực tiếp, không cần Blob
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
      console.log("Ký gửi vật phẩm thành công:", response.data);

      showSuccessMessage("Đã ký gửi vật phẩm thành công.");
      return response.data;
    } else {
      throw new Error(response.data.message || "Lỗi khi ký gửi vật phẩm.");
    }
  } catch (error) {
    console.error("Lỗi khi ký gửi vật phẩm:", error);
    showErrorMessage("Không thể ký gửi vật phẩm.");
    throw error;
  }
};

export const getHistoryConsign = async (
  sellerId: number,
  status?: number, // status là tùy chọn
  pageSize: number = 10,
  pageIndex: number = 1
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

      console.log("Lịch sử ký gửi:", response.data);
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

//  ra timeline
export const getDetailHistoryValuation = async (
  id: number
): Promise<TimeLineConsignment[]> => {
  try {
    const response = await apiClient.get<Response<TimeLineConsignment[]>>(
      `/api/Valuations/getDetailHistoryValuation?valuationId=${id}`
    );
    console.log("id", id);

    // console.log("responsegetDetailHistoryValuation", response);

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch sử định giá:", error);
    showErrorMessage("Không thể lấy chi tiết lịch sử định giá.");
    return [];
  }
};
