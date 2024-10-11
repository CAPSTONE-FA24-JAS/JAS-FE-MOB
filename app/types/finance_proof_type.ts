export interface FinancialProof {
  id: number;
  file: string;
  priceLimit: number;
  customerId: number;
  customerName: number;
  reason?: string;
  accountName: string;
  startDate: string;
  expireDate: string;
  status: "Pending" | "Approve" | "Reject"; // chưa biết tất cả trạng thái nên để v nhé
}
