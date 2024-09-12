import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  DeleteAccountResponse,
  ProfileResponse,
} from "@/app/types/profilte_type";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const getProfile = async (userId: number): Promise<ProfileResponse> => {
  try {
    const response = await axios.get<ProfileResponse>(
      `${API_URL}/api/Account/ViewProfile`,
      {
        params: {
          Id: userId,
        },
      }
    );

    if (response.data.isSuccess) {
      //   console.log("Lấy thông tin người dùng thành công:", response.data.data);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Lỗi khi lấy thông tin người dùng"
      );
    }
  } catch (error) {
    console.error("Lỗi khi gọi API ViewProfile:", error);
    showErrorMessage("Không thể lấy thông tin người dùng.");
    throw error;
  }
};

export const deleAccount = async (
  userId: number
): Promise<DeleteAccountResponse> => {
  try {
    const response = await axios.put<DeleteAccountResponse>(
      `${API_URL}/api/Account/DeleteAccount?Id=${userId}`,
      {
        params: {
          Id: userId,
        },
      }
    );

    if (response.data.isSuccess) {
      // Display success message
      showSuccessMessage("Đã xóa tài khoản thành công");

      return response.data;
    } else {
      throw new Error(response.data.message || "Lỗi khi xóa tài khoản");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API Delete Account:", error);
    showErrorMessage("Không thể xoá thông tin người dùng.");
    throw error;
  }
};
