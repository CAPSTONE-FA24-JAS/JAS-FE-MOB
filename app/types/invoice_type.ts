// invoice_type.ts

// Response structure for API calls
export interface InvoiceResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
  errorMessages: string[] | null;
}

// Structure for invoices by status
export interface InvoicesByStatusResponse {
  dataResponse: InvoiceData[];
  totalItemRepsone: number;
}

export interface InvoiceData {
  id: number;
  status: string;
  totalPrice: number;
  paymentMethodId: number | null;
  addressToShipId: number | null;
  shipperId: number;
  myBidDTO: MyBidDTO | null;
}

export interface MyBidDTO {
  id: number;
  status: string;
  isDeposit: boolean;
  autoBidPrice: number | null;
  priceLimit: number | null;
  isWinner: boolean | null;
  isRefunded: boolean | null;
  isInvoiced: boolean | null;
  lotId: number;
  yourMaxBidPrice: number | null;
  lotDTO: LotDto;
}

export interface LotDto {
  id: number;
  title: string;
  startPrice?: number;
  minPrice: any;
  currentPrice: any;
  finalPriceSold?: number;
  status: string;
  bidIncrement?: number;
  deposit: number;
  buyNowPrice?: number;
  floorFeePercent: number;
  startTime: string;
  endTime: string;
  actualEndTime: any;
  isExtend: boolean;
  haveFinancialProof: boolean;
  lotType: string;
  imageLinkJewelry: string;
  sellerId: any;
  staffId: number;
  jewelryId: number;
  auctionId: number;
}

// Structure for detailed invoice
export interface InvoiceDetailResponse {
  winnerId: number;
  winnerName: string;
  winnerPhone: string;
  winnerEmail: string;
  lotNumber: number | null;
  lotId: number;
  productId: number;
  productName: string;
  tax: number | null;
  note: string | null;
  addressToShip: string | null;
  id: number;
  status: string;
  totalPrice: number;
  paymentMethodId: number | null;
  addressToShipId: number | null;
  shipperId: number;
  myBidDTO: MyBidDTO | null;
}
