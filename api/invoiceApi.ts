import axios from "axios";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  InvoiceResponse,
  InvoicesByStatusResponse,
  InvoiceDetailResponse,
} from "@/app/types/invoice_type";
import { Alert } from "react-native";
import { EXPO_PUBLIC_API_URL } from "@env";

const API_URL = EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to upload a bill for an invoice
export const uploadBillForInvoice = async (
  invoiceId: number,
  fileBill: { uri: string; name: string; type: string }
): Promise<InvoiceResponse<null> | null> => {
  try {
    const formData = new FormData();
    const fileBlob = {
      uri: fileBill.uri,
      type: fileBill.type || "image/jpeg",
      name: fileBill.name || "payment_bill.jpg",
    };

    formData.append("FileBill", fileBlob as any);

    console.log("dataUpload", {
      invoiceId: invoiceId,
      FileBill: fileBill.uri,
    });

    const response = await fetch(
      `${API_URL}/api/Invoices/UploadBillForInvoice?InvoiceId=${invoiceId}`,
      {
        method: "PATCH", // Change to "POST" if the backend expects it
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const responseData = await response.json();

    if (response.ok && responseData.isSuccess) {
      console.log("Upload file bill transaction successfully:", responseData);
      showSuccessMessage("File bill uploaded successfully.");
      return responseData;
    } else {
      throw new Error(
        responseData.message || "Failed to upload the file bill."
      );
    }
  } catch (error) {
    console.error("Error uploading file bill:", error);
    showErrorMessage("Unable to upload file bill.");
    throw error;
  }
};

// Function to get invoices by status for a customer
export const getInvoicesByStatusForCustomer = async (
  customerId: number,
  status: number
): Promise<InvoiceResponse<InvoicesByStatusResponse> | null> => {
  console.log("customerId", customerId, "status", status);

  try {
    const response = await axios.get<InvoiceResponse<InvoicesByStatusResponse>>(
      `${API_URL}/api/Invoices/getInvoicesByStatusForCustomer`,
      {
        params: {
          customerId,
          status,
        },
        // Cho phép tất cả các mã trạng thái HTTP được coi là hợp lệ
        validateStatus: (status) => true,
      }
    );

    // Trả về dữ liệu phản hồi dù là thành công hay lỗi
    return response.data;
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    throw error; // Ném lỗi nếu có ngoại lệ khác
  }
};

// Function to get invoice details by invoice ID
export const getDetailInvoice = async (
  invoiceId: number
): Promise<InvoiceResponse<InvoiceDetailResponse> | null> => {
  try {
    const response = await axios.get<InvoiceResponse<InvoiceDetailResponse>>(
      `${API_URL}/api/Invoices/GetDetailInvoice`,
      {
        params: { invoiceId },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received invoice details:", response.data);
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to retrieve invoice details."
      );
    }
  } catch (error) {
    console.error("Error retrieving invoice details:", error);
    showErrorMessage("Unable to retrieve invoice details.");
    throw error;
  }
};

// Function to initiate payment of an invoice by VnPay
export const paymentInvoiceByVnPay = async (
  invoiceId: number,
  amount: number
): Promise<InvoiceResponse<string> | null> => {
  console.log("log paymentInvoiceByVnPay", invoiceId, amount);

  try {
    const response = await axios.post<InvoiceResponse<string>>(
      `${API_URL}/api/Invoices/paymentInvoiceByVnPay`,
      {
        invoiceId,
        amount,
      }
    );

    if (response.data.isSuccess) {
      console.log("Payment initiated:", response.data);
      showSuccessMessage("Payment initiated successfully.");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to initiate payment.");
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    showErrorMessage("Unable to initiate payment.");
    throw error;
  }
};

// Function to initiate payment of an invoice by wallet
export const paymentInvoiceByWallet = async (
  walletId: number,
  amount: number,
  invoiceId: number
): Promise<InvoiceResponse<null> | null> => {
  console.log(walletId, amount, invoiceId);

  try {
    const response = await axios.post<InvoiceResponse<null>>(
      `${API_URL}/api/Invoices/paymentInvoiceByWallet`,
      {
        walletId,
        amount,
        invoiceId,
      }
    );

    if (response.data.isSuccess) {
      console.log("Payment by wallet successful:", response.data);
      showSuccessMessage("Payment by wallet was successful.");
      return response.data;
    } else {
      // Hiển thị Alert với thông điệp lỗi từ phản hồi
      Alert.alert(
        "Lỗi Thanh Toán",
        response.data.message || "Failed to pay invoice by wallet.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return null; // Bạn có thể trả về null hoặc xử lý theo cách khác
    }
  } catch (error: any) {
    console.error("Error paying invoice by wallet:", error);

    // Kiểm tra xem lỗi có phải là lỗi Axios và có phản hồi không
    if (axios.isAxiosError(error) && error.response) {
      const serverMessage = error.response.data.message;
      Alert.alert(
        "Lỗi Thanh Toán",
        serverMessage || "Unable to pay invoice by wallet.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      // Lỗi không phải từ máy chủ hoặc không có phản hồi
      Alert.alert(
        "Lỗi Thanh Toán",
        "Unable to pay invoice by wallet.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    throw error; // Tiếp tục ném lỗi nếu bạn muốn xử lý ở nơi gọi hàm này
  }
};

// Function to update the shipping address for an invoice
export const updateAddressToShipForInvoice = async (
  invoiceId: number,
  addressToShipId: number
): Promise<InvoiceResponse<null> | null> => {
  console.log("updateAddressToShipForInvoice", invoiceId, addressToShipId);

  try {
    const response = await axios.patch<InvoiceResponse<null>>(
      `${API_URL}/api/Invoices/UpdateAddressToShipForInvoice`,
      {
        invoiceId,
        addressToShipId,
      }
    );

    if (response.data.isSuccess) {
      console.log("Update Invoice Successfully:", response.data);
      showSuccessMessage("Address updated successfully.");
      return response.data;
    } else {
      // showErrorMessage("Unable to update address.");
      return null;
    }
  } catch (error) {
    console.error("Error updating address:", error);
    // showErrorMessage("Unable to update address.");
    return null;
  }
};
