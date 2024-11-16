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
import { EXPO_PUBLIC_API_URL } from "@env";

const API_URL = EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Get Profile
export const getProfile = async (userId: number): Promise<ProfileResponse> => {
  console.log("userIdgetProfile", userId);

  try {
    const response = await axios.get<ProfileResponse>(
      `${API_URL}/api/Account/ViewProfile`,
      { params: { Id: userId } }
    );

    if (response.data.isSuccess) {
      console.log("Profile retrieved successfully:", response.data.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve profile.");
    }
  } catch (error) {
    console.error("API error on ViewProfile:", error);
    showErrorMessage("Unable to retrieve profile information.");
    throw error;
  }
};

// Delete Account
export const deleteAccount = async (
  userId: number
): Promise<DeleteAccountResponse> => {
  try {
    const response = await axios.put<DeleteAccountResponse>(
      `${API_URL}/api/Account/DeleteAccount`,
      null,
      { params: { Id: userId } }
    );

    if (response.data.isSuccess) {
      showSuccessMessage("Account deleted successfully.");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to delete account.");
    }
  } catch (error) {
    console.error("API error on Delete Account:", error);
    showErrorMessage("Unable to delete account.");
    throw error;
  }
};

// (Optional) Update Profile
export const updateProfile = async (
  userId: number,
  profileData: any
): Promise<ProfileResponse> => {
  try {
    const response = await axios.put<ProfileResponse>(
      `${API_URL}/api/Account/UpdateProfile`,
      profileData,
      { params: { Id: userId } }
    );

    if (response.data.isSuccess) {
      showSuccessMessage("Profile updated successfully.");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to update profile.");
    }
  } catch (error) {
    console.error("API error on Update Profile:", error);
    showErrorMessage("Unable to update profile.");
    throw error;
  }
};
