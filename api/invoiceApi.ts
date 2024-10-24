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

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Function to get invoices by status for a customer
// export const getInvoicesByStatusForCustomer = async (
//   customerId: number,
//   status: number
// ): Promise<InvoiceResponse<InvoicesByStatusResponse> | null> => {
//   console.log("customerId", customerId, "status", status);

//   try {
//     const response = await axios.get<InvoiceResponse<InvoicesByStatusResponse>>(
//       `${API_URL}/api/Invoices/getInvoicesByStatusForCustomer`,
//       {
//         params: {
//           customerId,
//           status,
//         },
//       }
//     );

//     if (response.data.isSuccess) {
//       //   console.log("Received invoices by status:", response.data);
//       return response.data;
//     } else {
//       // Trả về response khi isSuccess là false để xử lý sau này
//       return response.data;
//     }
//   } catch (error) {
//     console.error("Error retrieving invoices:", error);
//     throw error; // Chỉ throw lỗi khi có ngoại lệ khác
//   }
// };

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
