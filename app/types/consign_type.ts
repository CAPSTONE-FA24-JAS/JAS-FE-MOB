export interface HistoryConsignmentResponse {
  dataResponse: dataResponseConsignList;
  totalItemRepsone: number;
}

export interface dataResponseConsignList {
  id: number;
  name: string;
  description: string;
  pricingTime?: string;
  height: any;
  width: any;
  depth: any;
  estimatePriceMin?: number;
  estimatePriceMax?: number;
  imageOfReceip: any;
  actualStatusOfJewelry: any;
  status: string;
  cancelReason: any;
  sellerId: number;
  staffId?: number;
  creationDate: string;
  seller: Seller;
  staff?: Staff;
  appraiser?: Appraiser;
  imageValuations: ImageValuation[];
  valuationDocuments: [];
}

export interface ImageValuation {
  id: number;
  imageLink: string;
  valuationId: number;
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
  priceLimit: any;
  accountDTO: AccountDtoSeller;
}

export interface AccountDtoSeller {
  id: number;
  email: string;
  phoneNumber: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: any;
  staffDTO: any;
}

export interface TimeLineConsignment {
  statusName: string;
  valuationId: number;
  creationDate: string;
}

// người định giá
export interface Appraiser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: string;
  dateOfBirth: string;
  accountDTO: AccountDtoAppraiser;
}

export interface AccountDtoAppraiser {
  id: number;
  email: string;
  phoneNumber: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: any;
  staffDTO: any;
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gender: string;
  dateOfBirth: string;
  accountDTO: AccountDtoStaff;
}

export interface AccountDtoStaff {
  id: number;
  email: string;
  phoneNumber: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: any;
  staffDTO: any;
}
