import {
  DeleteAccountResponse,
  ProfileResponse,
} from "@/app/types/profilte_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

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
export const updateProfile = async (
  userId: number,
  profileData: {
    email: string;
    gender: string | null;
    profileImage: string | null;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    address: string | null;
    citizenIdentificationCard: string | null;
    idIssuanceDate: string | null;
    idExpirationDate: string | null;
  }
): Promise<ProfileResponse> => {
  const formData = new FormData();

  formData.append("Id", userId.toString());
  formData.append("Email", profileData.email || "");
  formData.append("Gender", profileData.gender || "");
  formData.append("CustomerProfileDTO.FirstName", profileData.firstName);
  formData.append("CustomerProfileDTO.LastName", profileData.lastName);
  formData.append(
    "CustomerProfileDTO.DateOfBirth",
    profileData.dateOfBirth || ""
  );
  formData.append("CustomerProfileDTO.Address", profileData.address || "");
  formData.append(
    "CustomerProfileDTO.CitizenIdentificationCard",
    profileData.citizenIdentificationCard || ""
  );
  formData.append(
    "CustomerProfileDTO.IDIssuanceDate",
    profileData.idIssuanceDate || ""
  );
  formData.append(
    "CustomerProfileDTO.IDExpirationDate",
    profileData.idExpirationDate || ""
  );

  // Check if profileImage exists and append it as a file directly
  if (profileData.profileImage) {
    const filename = profileData.profileImage.split("/").pop();
    const fileUri = profileData.profileImage;

    // Use the same method from consignAnItem
    formData.append("ProfileImage", {
      uri: fileUri,
      name: filename,
      type: "image/jpeg", // Ensure the correct type if needed
    } as any); // You can adjust this type if needed
  }

  const response = await axios.put<ProfileResponse>(
    `${API_URL}/api/Account/UpdateProfile`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: { Id: userId }, // Query parameter
    }
  );

  return response.data;
};
