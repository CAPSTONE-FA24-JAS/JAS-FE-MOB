// // =============== get list consignment history ===============
// export interface HistoryConsignmentResponse {
//   $id?: string;
//   code: number;
//   message: string;
//   isSuccess: boolean;
//   data: ConsignsData;
//   errorMessages: any;
// }

// export interface ConsignsData {
//   $id?: string;
//   dataResponse: ConsignResponse;
//   totalItemRepsone: number;
// }

// export interface ConsignResponse {
//   $id: string;
//   $values: ValueConsign[];
// }

// export interface ValueConsign {
//   $id?: string;
//   id: number;
//   name: string;
//   pricingTime: any;
//   desiredPrice: any;
//   height: number;
//   width: number;
//   depth: number;
//   estimatePriceMin: any;
//   estimatePriceMax: any;
//   description: string;
//   actualStatusOfJewelry: any;
//   status: string; // vẫn là string
//   sellerId: number;
//   staffId?: any;
//   seller: Seller;
//   imageValuations: ImageValuation;
//   valuationDocuments: ValuationDocuments;
//   note?: string; // không có note
// }

// export interface AccountDto {
//   $id?: string;
//   email: string;
//   gender: any;
//   passwordHash: string;
//   roleId: number;
//   roleName: string;
//   customerDTO: CustomerDto;
//   staffDTO: any;
// }

// export interface CustomerDto {
//   $ref: string;
// }

// export interface ImageValuation {
//   $id?: string;
//   $values: Value2[];
// }

// export interface Value2 {
//   $id?: string;
//   id: number;
//   imageLink: string;
//   valuationId: number;
// }

// export interface ValuationDocuments {
//   $id?: string;
//   $values: any[];
// }
//////////////////////////////////////////////////////////////

export interface HistoryConsignmentResponse {
  dataResponse: dataResponseConsignList;
  totalItemRepsone: number;
}

export interface dataResponseConsignList {
  id: number;
  name: string;
  description: string;
  pricingTime: string | null;
  height: number;
  width: number;
  depth: number;
  estimatePriceMin: number | null;
  estimatePriceMax: number | null;
  imageOfReceip: string | null;
  actualStatusOfJewelry: string | null;
  status: string;
  cancelReason: string | null;
  sellerId: number;
  staffId: number | null;
  creationDate: string;
  seller: Seller;
  staff: string | null;
  imageValuations: [
    {
      id: number;
      imageLink: string;
      valuationId: number;
    }
  ];
  valuationDocuments: [];
}

export interface Seller {
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
  accountDTO: {
    id: number;
    email: string;
    gender: string | null;
    passwordHash: string;
    roleId: number;
    roleName: string;
    customerDTO: any | null;
    staffDTO: any | null;
  };
  bidLimits: {
    id: number;
    file: string;
    priceLimit: number | null;
    customerId: number;
    customerName: string | null;
    reason: string | null;
    startDate: string;
    expireDate: string;
    status: string;
  }[];
}

export interface TimeLineConsignment {
  statusName: string;
  valuationId: 30;
  creationDate: string;
}
