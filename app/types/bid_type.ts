// ================ getBidsOfCustomer current ============
export interface CurentBidResponse<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
  errorMessages: string[] | null;
}

export interface DataCurentBid {
  dataResponse: DataCurentBidResponse[];
  totalItemRepsone: number;
}

export interface DataCurentBidResponse {
  id: number;
  status: string;
  isDeposit: boolean;
  autoBidPrice: any;
  priceLimit: any;
  isWinner: any;
  isRefunded: any;
  isInvoiced: any;
  lotId: number;
  yourMaxBidPrice: any;
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
  endPrice?: number;
}

// ================== GetMyBidByCustomerLotId ===================
export interface GetMyBidResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: MyBidData;
  errorMessages: string[] | null;
}

export interface MyBidData {
  historyStatusCustomerLots: any[];
  id: number;
  status: string;
  isDeposit: boolean;
  autoBidPrice: any;
  priceLimit: any;
  isWinner: any;
  isRefunded: any;
  isInvoiced: any;
  lotId: number;
  yourMaxBidPrice: any;
  lotDTO: LotDto;
}
