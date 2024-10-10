// =============== get list consignment history ===============
export interface HistoryConsignmentResponse {
  $id?: string;
  code: number;
  message: string;
  isSuccess: boolean;
  data: ConsignsData;
  errorMessages: any;
}

export interface ConsignsData {
  $id?: string;
  dataResponse: ConsignResponse;
  totalItemRepsone: number;
}

export interface ConsignResponse {
  $id: string;
  $values: ValueConsign[];
}

export interface ValueConsign {
  $id?: string;
  id: number;
  name: string;
  pricingTime: any;
  desiredPrice: any;
  height: number;
  width: number;
  depth: number;
  estimatePriceMin: any;
  estimatePriceMax: any;
  description: string;
  actualStatusOfJewelry: any;
  status: string; // vẫn là string
  sellerId: number;
  staffId?: any;
  seller: Seller;
  imageValuations: ImageValuation;
  valuationDocuments: ValuationDocuments;
  note?: string; // không có note
}

export interface Seller {
  $id?: string;
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  citizenIdentificationCard: string;
  idIssuanceDate: string;
  idExpirationDate: string;
  accountDTO: AccountDto;
}

export interface AccountDto {
  $id?: string;
  email: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: CustomerDto;
  staffDTO: any;
}

export interface CustomerDto {
  $ref: string;
}

export interface ImageValuation {
  $id?: string;
  $values: Value2[];
}

export interface Value2 {
  $id?: string;
  id: number;
  imageLink: string;
  valuationId: number;
}

export interface ValuationDocuments {
  $id?: string;
  $values: any[];
}
