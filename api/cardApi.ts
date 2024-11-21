import { Response } from "@/app/types/respone_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import axios from "axios";

export interface ResponseBank<T> {
  code: string;
  desc: string;
  data: T[];
}

export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export interface BankAccountInfo {
  bankName: string;
  bankAccountHolder: string;
  bankCode: string;
  customerId: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchBanks = async (): Promise<Bank[] | []> => {
  try {
    const response = await axios.get<ResponseBank<Bank>>(
      "https://api.vietqr.io/v2/banks"
    );
    const result = await response.data;

    if (result.code === "00") {
      console.log("Danh sách ngân hàng:", result.data);
      return result.data;
    }
    return [];
  } catch (error) {
    console.error("Lỗi tải danh sách ngân hàng:", error);
    return [];
  }
};

export const getAllCardByCustomerId = async (
  customerId: number
): Promise<BankAccountInfo[] | []> => {
  try {
    const response = await axios.get<Response<BankAccountInfo[]>>(
      `${API_URL}/api/Account/GetAllCreditCardByCustomer?customerId=${customerId}`
    );

    if (response.data.isSuccess && response.data.data) {
      console.log("Danh sách thẻ:", response.data.data);
      showSuccessMessage("Danh sách thẻ tải thành công.");
      return response.data.data;
    }
    if (response.data.data && response.data.isSuccess) {
      console.log("Danh sách thẻ:", response.data.data);
      showSuccessMessage("Bạn cần thêm thẻ để thực hiện giao dịch sau này.");
      return response.data.data;
    }
    if (!response.data.isSuccess) {
      showErrorMessage("Không thể tải danh sách thẻ.");
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thẻ:", error);
    return [];
  }
};

export const addBankAccount = async (
  bankAccount: BankAccountInfo
): Promise<Response<BankAccountInfo> | undefined> => {
  try {
    console.log("Thông tin tài khoản ngân hàng:", bankAccount);

    const response = await axios.post<Response<BankAccountInfo>>(
      `${API_URL}/api/Account/AddNewCreditCard`,
      {
        bankName: bankAccount.bankName,
        bankAccountHolder: bankAccount.bankAccountHolder,
        bankCode: bankAccount.bankCode,
        customerId: bankAccount.customerId,
      }
    );

    if (response.data.isSuccess) {
      showSuccessMessage("Thêm tài khoản ngân hàng thành công.");
      return response.data;
    }
    showErrorMessage("Không thể thêm tài khoản ngân hàng.");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm tài khoản ngân hàng:", error);
    return undefined;
  }
};
