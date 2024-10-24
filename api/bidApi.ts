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
} from "@/app/types/bid_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export type GetBidsOfCustomerResponse = CurentBidResponse<DataCurentBid>;
export type GetPastBidOfCustomerResponse = CurentBidResponse<DataCurentBid>;

// Function to get bids of a customer
export const getBidsOfCustomer = async (
  customerId: number,
  status: number,
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<GetBidsOfCustomerResponse | null> => {
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
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<GetPastBidOfCustomerResponse | null> => {
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
