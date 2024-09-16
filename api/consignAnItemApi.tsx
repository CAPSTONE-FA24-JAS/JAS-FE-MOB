import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { HistoryConsignmentResponse } from "@/app/types/consign_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const consignAnItem = async (
  sellerId: number,
  name: string,
  height: number,
  width: number,
  depth: number,
  description: string,
  images: string[]
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

    console.log("formDataNe", formData);

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

// Hàm lấy lịch sử ký gửi
export const getHistoryConsign = async (
  sellerId: number,
  status: string = "",
  pageSize: number = 10,
  pageIndex: number = 1
): Promise<HistoryConsignmentResponse> => {
  try {
    // Gửi yêu cầu GET với các tham số
    const response = await axios.get<HistoryConsignmentResponse>(
      `${API_URL}/api/Valuations/getPreliminaryValuationByStatusOfSeller`,
      {
        params: {
          sellerId: sellerId,
          status: status,
          pageSize: pageSize,
          pageIndex: pageIndex,
        },
      }
    );

    // Kiểm tra phản hồi thành công hay không
    if (response.data.isSuccess) {
      console.log("Lịch sử ký gửi:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Lỗi khi lấy lịch sử ký gửi.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử ký gửi:", error);
    showErrorMessage("Không thể lấy lịch sử ký gửi.");
    throw error;
  }
};
