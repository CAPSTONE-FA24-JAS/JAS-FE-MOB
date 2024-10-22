// myBidApi.ts
import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Type Definitions

export interface ApiResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
  errorMessages: string[] | null;
}

export interface BidItem {
  id: number;
  title: string;
  startPrice: number | null;
  minPrice: number | null;
  currentPrice: number | null;
  finalPriceSold: number | null;
  status: string;
  bidIncrement: number | null;
  deposit: number;
  buyNowPrice: number | null;
  floorFeePercent: number;
  startTime: string; // ISO Date string
  endTime: string; // ISO Date string
  actualEndTime: string | null; // ISO Date string or null
  isExtend: boolean;
  haveFinancialProof: boolean;
  lotType: string;
  imageLinkJewelry: string;
  sellerId: number | null;
  staffId: number;
  jewelryId: number;
  auctionId: number;
  endPrice?: number; // chỉ dùng trong phương thức đầu giá ngược
  isWin?: boolean; // chỉ dùng trong Past & chưa có api
  yourMaxBid?: number; // chỉ dùng trong Past & chưa có api
}

interface PaginatedResponse {
  dataResponse: BidItem[];
  totalItemRepsone: number;
}

export type GetBidsOfCustomerResponse = ApiResponse<PaginatedResponse>;
export type GetPastBidOfCustomerResponse = ApiResponse<PaginatedResponse>;

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
