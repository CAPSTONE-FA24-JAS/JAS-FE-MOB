export interface ReponseConsignDetail {
  code: number;
  message: string;
  isSuccess: boolean;
  data: DataConsignDetail;
  errorMessages: any;
}

export interface DataConsignDetail {
  id: number;
  name: string;
  description: string;
  pricingTime: string;
  height: number;
  width: number;
  depth: number;
  estimatePriceMin: number;
  estimatePriceMax: number;
  imageOfReceip: any;
  actualStatusOfJewelry: string;
  status: string;
  cancelReason: string;
  sellerId: number;
  staffId: number;
  creationDate: string;
  seller: Seller;
  staff: Staff;
  appraiser: Appraiser;
  imageValuations: ImageValuation[];
  valuationDocuments: ValuationDocument[];
  jewelry: Jewelry;
}

export interface Seller {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: any;
  dateOfBirth: string;
  address: any;
  citizenIdentificationCard: string;
  idIssuanceDate: string;
  idExpirationDate: string;
  priceLimit: number;
  expireDate: string;
  walletId: number;
  walletDTO: WalletDto;
  accountDTO: AccountDto;
}

export interface WalletDto {
  id: number;
  balance: number;
  availableBalance: number;
  frozenBalance: any;
  customerDTO: any;
}

export interface AccountDto {
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
  profilePicture: string;
  gender: string;
  dateOfBirth: string;
  accountDTO: AccountDto2;
}

export interface AccountDto2 {
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

export interface Appraiser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: string;
  dateOfBirth: string;
  accountDTO: AccountDto3;
}

export interface AccountDto3 {
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

export interface ImageValuation {
  id: number;
  imageLink: string;
  valuationId: number;
  defaultImage?: string;
}

export interface ValuationDocument {
  id: number;
  documentLink: string;
  valuationId: number;
  valuationDocumentType: string;
  signatureCode: any;
  creationDate: string;
  createdBy: number;
}

export interface Jewelry {
  id: number;
  name: string;
  description: any;
  estimatePriceMin: number;
  estimatePriceMax: number;
  startingPrice: number;
  specificPrice: number;
  videoLink: string;
  forGender: string;
  title: any;
  bidForm: string;
  time_Bidding: any;
  status: string;
  artistId: number;
  categoryId: number;
  valuationId: number;
  artist: Artist;
  category: Category;
  imageJewelries: ImageJewelry[];
  keyCharacteristicDetails: KeyCharacteristicDetail[];
  mainDiamonds: any[];
  secondaryDiamonds: any[];
  mainShaphies: MainShaphy[];
  secondaryShaphies: any[];
  valuation: any;
}

export interface Artist {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ImageJewelry {
  imageLink: string;
  title: string;
  thumbnailImage: string;
  jewelryId: number;
}

export interface KeyCharacteristicDetail {
  id: number;
  description: string;
  jewelryId: number;
  keyCharacteristicId: number;
  keyCharacteristic: KeyCharacteristic;
}

export interface KeyCharacteristic {
  id: number;
  name: string;
}

export interface MainShaphy {
  id: number;
  name: string;
  color: string;
  carat: number;
  enhancementType: any;
  quantity: number;
  settingType: any;
  dimension: any;
  jewelryId: number;
  documentShaphies: any[];
  imageShaphies: ImageShaphy[];
}

export interface ImageShaphy {
  imageLink: string;
  shaphieId: any;
}
