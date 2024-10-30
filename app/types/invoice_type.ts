// invoice_type.ts

import { DataCurentBidResponse } from "./bid_type";

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
  myBidDTO: DataCurentBidResponse | null;
}

export interface MyBidDTO {
  id: number;
  status: string;
  isDeposit: boolean;
  autoBidPrice: any;
  priceLimit: any;
  isWinner: any;
  isRefunded: any;
  isInvoiced: any;
  yourMaxBidPrice: any;
  lotId: number;
  lotDTO: LotDto;
  historyCustomerLots: HistoryCustomerLot[];
}
export interface HistoryCustomerLot {
  currentTime: string;
  status: string;
  customerLotId: number;
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
  endPrice?: number;
}

// Structure for detailed invoice
export interface InvoiceDetailResponse {
  winnerId: number;
  winnerName: string;
  winnerPhone: string;
  winnerEmail: string;
  lotNumber: any;
  lotId: number;
  productId: number;
  productName: string;
  tax: any;
  note: any;
  addressToShip: any;
  statusInvoiceDTOs: StatusInvoiceDto[];
  id: number;
  status: string;
  totalPrice: number;
  paymentMethodId: any;
  addressToShipId: any;
  linkBillTransaction: string;
  shipperId: number;
  creationDate: string;
  myBidDTO: MyBidDTO | null;
}

export interface StatusInvoiceDto {
  id: number;
  status: string;
  imageLink: string;
  currentDate: string;
  invoiceId: number;
}
