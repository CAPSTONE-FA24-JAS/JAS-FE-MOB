// addressApi.ts
import axios from "axios";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import {
  AddressListResponse,
  ListDistrictReponse,
  ListProvinceResponse,
  ListWardResponse,
} from "@/app/types/address_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";
const GHN_API_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = "648d5484-1c1d-11ef-8bfa-8a2dda8ec551";

// Function to get list of addresses by customer ID
export const getAddressesByCustomerId = async (
  customerId: number
): Promise<AddressListResponse | null> => {
  try {
    const response = await axios.get<AddressListResponse>(
      `${API_URL}/api/AddressToShip/ViewListAddressToShipByCustomer`,
      {
        params: { customerId },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received list of addresses:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve addresses.");
    }
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    // showErrorMessage("Unable to retrieve addresses.");
    throw error;
  }
};

// Function to create a new address
export const createAddressToShip = async (
  addressLine: string,
  customerId: number
): Promise<{ isSuccess: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/AddressToShip/CreateAddressToShip`,
      {
        addressLine,
        customerId,
      }
    );

    if (response.data.isSuccess) {
      showErrorMessage("Address created successfully!");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create address.");
    }
  } catch (error) {
    console.error("Error creating address:", error);
    showErrorMessage("Unable to create address.");
    throw error;
  }
};

// Function to set an address as default
export const setAddressToShipIsDefault = async (
  id: number,
  customerId: number
): Promise<{ isSuccess: boolean; message: string }> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/AddressToShip/SetAddressToShipIsDefault`,
      null, // PATCH thường không có body nếu bạn sử dụng query params
      {
        params: { Id: id, customerId },
      }
    );

    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to set default address."
      );
    }
  } catch (error) {
    console.error("Error setting default address:", error);
    showErrorMessage("Unable to set default address.");
    throw error;
  }
};

// Function to delete an address
export const deleteAddressToShip = async (
  id: number
): Promise<{ isSuccess: boolean; message: string }> => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/AddressToShip/DeleteAddressToShip`,
      {
        params: { Id: id },
      }
    );

    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to delete address.");
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    showErrorMessage("Unable to delete address.");
    throw error;
  }
};

// API GHN

// Function to get list of provinces
export const getProvinces = async (): Promise<ListProvinceResponse | null> => {
  try {
    const response = await axios.get<ListProvinceResponse>(
      `${GHN_API_URL}/master-data/province`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
      }
    );

    if (response.data.code === 200) {
      console.log("Provinces fetched successfully:", response.data.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve provinces.");
    }
  } catch (error) {
    console.error("Error retrieving provinces:", error);
    return null;
  }
};

// Function to get list of districts by province ID
export const getDistrictsByProvince = async (
  provinceId: number
): Promise<ListDistrictReponse | null> => {
  try {
    const response = await axios.get<ListDistrictReponse>(
      `${GHN_API_URL}/master-data/district`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
        params: {
          province_id: provinceId,
        },
      }
    );

    if (response.data.code === 200) {
      console.log("Districts fetched successfully:", response.data.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve districts.");
    }
  } catch (error) {
    console.error("Error retrieving districts:", error);
    return null;
  }
};

// Function to get list of wards by district ID
export const getWardsByDistrict = async (
  districtId: number
): Promise<ListWardResponse | null> => {
  try {
    const response = await axios.get<ListWardResponse>(
      `${GHN_API_URL}/master-data/ward`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
        params: {
          district_id: districtId,
        },
      }
    );

    if (response.data.code === 200) {
      console.log("Wards fetched successfully:", response.data.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve wards.");
    }
  } catch (error) {
    console.error("Error retrieving wards:", error);
    return null;
  }
};
