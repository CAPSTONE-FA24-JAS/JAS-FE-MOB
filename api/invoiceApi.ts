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
export const getInvoicesByStatusForCustomer = async (
  customerId: number,
  status: number,
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<InvoiceResponse<InvoicesByStatusResponse> | null> => {
  try {
    const response = await axios.get<InvoiceResponse<InvoicesByStatusResponse>>(
      `${API_URL}/api/Invoices/getInvoicesByStatusForCustomer`,
      {
        params: {
          customerId,
          status,
          pageIndex,
          pageSize,
        },
      }
    );

    if (response.data.isSuccess) {
      console.log("Received invoices by status:", response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to retrieve invoices.");
    }
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    showErrorMessage("Unable to retrieve invoices.");
    throw error;
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
