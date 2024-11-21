// myBidApi.ts
import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  CurentBidResponse,
  DataCurentBid,
  GetMyBidResponse,
  PlaceBidResponse,
} from "@/app/types/bid_type";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export type GetBidsOfCustomerResponse = CurentBidResponse<DataCurentBid>;
export type GetPastBidOfCustomerResponse = CurentBidResponse<DataCurentBid>;

// New function to place a bid
export const placeBidFixedPriceAndSecret = async (
  currentPrice: number,
  customerId: number,
  lotId: number
): Promise<PlaceBidResponse | null> => {
  try {
    console.log("body method12", currentPrice, customerId, lotId);

    const response = await axios.post<PlaceBidResponse>(
      `${API_URL}/api/BidPrices/PlaceBidFixedPriceAndSercet`,
      {
        currentPrice,
        customerId,
        lotId,
      }
    );

    if (response.data.isSuccess) {
      showSuccessMessage(response.data.message || "Bid placed successfully!");
      return response.data;
    } else {
      // Handle specific error message
      if (
        response.data.message === "The customer is not register into the lot"
      ) {
        showErrorMessage(
          "You are not registered for this lot. Please register first."
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to place bid.");
        showErrorMessage(response.data.message || "Failed to place bid.");
      }
      return null;
    }
  } catch (error) {
    // Check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
      // Extract error response data if available
      const errorResponse = error.response?.data;

      // Handle specific error message
      if (
        errorResponse?.message === "The customer is not register into the lot"
      ) {
        showErrorMessage(
          "You are not registered for this lot. Please register first."
        );
      } else {
        // Handle other errors from Axios response
        showErrorMessage(
          errorResponse?.message || "Request failed with status code 400."
        );
      }
    } else {
      // Handle general errors
      console.error("Error placing bid:", error);
      showErrorMessage("Unable to place bid. Please try again.");
    }
    return null;
  }
};

// Function to get bids of a customer
export const getBidsOfCustomer = async (
  customerId: number,
  status: number,
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<GetBidsOfCustomerResponse | null> => {
  console.log("getCURRENTBidOfCustomerRUN", {
    customerId,
    status,
    pageIndex,
  });

  try {
    const response = await axios.get<GetBidsOfCustomerResponse>(
      `${API_URL}/api/CustomerLots/GetBidsOfCustomer`,
      {
        params: {
          customerIId: customerId,
          status,
          pageIndex,
          pageSize,
        },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received bids of customer:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve bids.");
    }
  } catch (error) {
    console.error("Error retrieving bids of customer:", error);
    showErrorMessage("Unable to retrieve bids of customer.");
    throw error;
  }
};

// Function to get past bids of a customer
export const getPastBidOfCustomer = async (
  customerId: number,
  status: number[],
  pageIndex: number,
  pageSize: number
): Promise<GetPastBidOfCustomerResponse | null> => {
  console.log("getPastBidOfCustomerRUN");

  try {
    const response = await axios.get<GetPastBidOfCustomerResponse>(
      `${API_URL}/api/CustomerLots/GetPastBidOfCustomer`,
      {
        params: {
          customerIId: customerId,
          status,
          pageIndex,
          pageSize,
        },
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
              value.forEach((val) => searchParams.append(key, val.toString()));
            } else {
              searchParams.append(key, value.toString());
            }
          });
          return searchParams.toString();
        },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received past bids of customer:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve past bids.");
    }
  } catch (error) {
    console.error("Error retrieving past bids of customer:", error);
    showErrorMessage("Unable to retrieve past bids of customer.");
    throw error;
  }
};

export const buyNowMethod3 = async (
  customerId: number,
  lotId: number
): Promise<PlaceBidResponse | null> => {
  try {
    const response = await axios.post<PlaceBidResponse>(
      `${API_URL}/api/BidPrices/PlaceBuyNow/place-buy-now`,
      {
        customerId,
        lotId,
      }
    );

    if (response.data.isSuccess) {
      showSuccessMessage(response.data.message || "Bid placed successfully!");
      return response.data;
    } else {
      // Handle specific error message
      if (
        response.data.message === "The customer is not register into the lot"
      ) {
        showErrorMessage(
          "You are not registered for this lot. Please register first."
        );
      } else {
        showErrorMessage(response.data.message || "Failed to Buy now bid.");
      }

      return null;
    }
  } catch (error) {
    // Check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
      // Extract error response data if available
      const errorResponse = error.response?.data;

      // Handle specific error message
      if (
        errorResponse?.message === "The customer is not register into the lot"
      ) {
        showErrorMessage(
          "You are not registered for this lot. Please register first."
        );
      } else {
        // Handle other errors from Axios response
        showErrorMessage(
          errorResponse?.message || "Request failed with status code 400."
        );
      }
    } else {
      // Handle general errors
      console.error("Error placing bid:", error);
      showErrorMessage("Unable to place bid. Please try again.");
    }
    return null;
  }
};

// Function to get my bid by customer lot ID
export const getMyBidByCustomerLotId = async (
  customerLotId: number
): Promise<GetMyBidResponse | null> => {
  try {
    const response = await axios.get<GetMyBidResponse>(
      `${API_URL}/api/CustomerLots/GetMyBidByCustomerLotId`,
      {
        params: { customerLotId },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received bid details:", response.data);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve bid details."
      );
    }
  } catch (error) {
    console.error("Error retrieving bid details:", error);
    showErrorMessage("Unable to retrieve bid details.");
    throw error;
  }
};
