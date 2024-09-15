export interface FinancialProof {
  id: number;
  file: string;
  priceLimit: number;
  accountId: number;
  accountName: string;
  startDate: string;
  expireDate: string;
  status: string; // chưa biết tất cả trạng thái nên để v nhé
}
