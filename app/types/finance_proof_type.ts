export interface FinancialProof {
  id: number;
  file: string | null;
  priceLimit: number;
  customerId: number;
  staffId: number | null;
  staffName: string;
  customerName: string;
  reason: string;
  startDate: string;
  expireDate: string;
  status: string;
}
