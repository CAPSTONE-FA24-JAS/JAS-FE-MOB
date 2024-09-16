// =============== get list consignment history ===============
export interface HistoryConsignmentResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: ConsignsData;
  errorMessages: any;
}

export interface ConsignsData {
  dataResponse: ConsignResponse[];
  totalItemRepsone: number;
}

export interface ConsignResponse {
  id: number;
  name: string;
  pricingTime: any;
  desiredPrice: any;
  height: number;
  width: number;
  depth: number;
  description: string;
  status: string;
  sellerId: number;
  staffId: any;
  seller: Seller;
  imageValuations: ImageValuation[];
}

export interface Seller {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: any;
  email: string;
  gender: string;
  address: any;
  passwordHash: string;
  status: boolean;
  phoneNumber: string;
  confirmationToken: string;
  isConfirmed: boolean;
  vnPayAccount: any;
  vnPayBankCode: any;
  vnPayAccountName: any;
  roleId: number;
  roleName: any;
}

export interface ImageValuation {
  imageLink: string;
  valuationId: number;
}
