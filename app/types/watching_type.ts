export interface WatchingResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: WatchingData[];
  errorMessages: any;
}

export interface WatchingData {
  id: number;
  customerId: number;
  jewelryId: number;
  jewelryDTO: JewelryDto;
}

export interface JewelryDto {
  id: number;
  name: string;
  description: any;
  estimatePriceMin: number;
  estimatePriceMax: number;
  startingPrice: number;
  specificPrice: number;
  videoLink: any;
  forGender?: string;
  title?: string;
  bidForm: string;
  time_Bidding: string;
  artistId: number;
  categoryId: number;
  valuationId: number;
  artist: Artist;
  category: Category;
  imageJewelries: ImageJewelry[];
  keyCharacteristicDetails: KeyCharacteristicDetail[];
  mainDiamonds: MainDiamond[];
  secondaryDiamonds: SecondaryDiamond[];
  mainShaphies: MainShaphy[];
  secondaryShaphies: SecondaryShaphy[];
  valuation: Valuation;
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

export interface MainDiamond {
  id: number;
  name: any;
  color: any;
  cut: any;
  clarity: any;
  quantity: number;
  settingType: any;
  dimension: any;
  shape: any;
  certificate: any;
  fluorescence: any;
  lengthWidthRatio: any;
  type: any;
  jewelryId: number;
  documentDiamonds: any[];
  imageDiamonds: any[];
}

export interface SecondaryDiamond {
  id: number;
  name: string;
  color: string;
  cut: string;
  clarity: string;
  quantity: number;
  settingType: any;
  dimension: any;
  shape: string;
  certificate: any;
  fluorescence: any;
  lengthWidthRatio: any;
  type: any;
  jewelryId: number;
  documentDiamonds: any[];
  imageDiamonds: any[];
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
  imageShaphies: any[];
}

export interface SecondaryShaphy {
  id: number;
  name: any;
  color: any;
  carat: any;
  enhancementType: any;
  quantity: number;
  settingType: any;
  dimension: any;
  jewelryId: number;
  documentShaphies: any[];
  imageShaphies: any[];
}

export interface Valuation {
  id: number;
  name: string;
  description: string;
  pricingTime?: string;
  height: number;
  width: number;
  depth: number;
  estimatePriceMin?: number;
  estimatePriceMax?: number;
  imageOfReceip: any;
  actualStatusOfJewelry?: string;
  status: string;
  cancelReason: any;
  sellerId: number;
  staffId: number;
  creationDate: string;
  seller: Seller;
  staff: Staff;
  appraiser?: Appraiser;
  imageValuations: ImageValuation[];
  valuationDocuments: ValuationDocument[];
  jewelry: any;
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
  priceLimit: number;
  expireDate: string;
  walletId: number;
  walletDTO: WalletDto;
  accountDTO: AccountDto;
}

export interface WalletDto {
  id: number;
  balance: number;
  availableBalance: any;
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

export default {};
