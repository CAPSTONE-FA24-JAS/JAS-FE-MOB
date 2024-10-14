// ============= get api/Auction/ViewAutions && /Auction/GetAuctionsByStatus  ==============
export interface ViewAutionsReponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: AuctionsData[];
  errorMessages: any;
}

export interface AuctionsData {
  id: number;
  name?: string;
  startTime: string;
  endTime: string;
  actualEndTime: any;
  description: string;
  imageLink: string;
  status: string;
  totalLot: number;
  winner?: string;
}

// Enum for Auction Status
export enum AuctionStatus {
  NotStarted = 1,
  Living = 2,
  Past = 3,
}

//================== api/Auction/ViewAutionById ==================
export interface ViewAutionIdReponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: AuctionData;
  errorMessages: any;
}

export interface AuctionData {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  actualEndTime: any;
  description: string;
  imageLink: string;
  status: string;
}
