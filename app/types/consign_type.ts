export interface HistoryConsignmentResponse {
  dataResponse: dataResponseConsignList[];
  totalItemRepsone: number;
}

export interface dataResponseConsignList {
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
  staffId?: number;
  creationDate: string;
  seller: Seller;
  staff?: Staff;
  appraiser?: Appraiser;
  imageValuations: ImageValuation[];
  valuationDocuments: ValuationDocument[];
  jewelry: Jewelry;
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
  startingPrice?: number;
  specificPrice?: number;
  videoLink?: string;
  forGender?: string;
  title?: string;
  bidForm?: string;
  time_Bidding?: string;
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
  valuation: any;
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
  priceLimit: number;
  expireDate: string;
  walletId: number;
  walletDTO: WalletDtoSeller;
  accountDTO: AccountDtoSeller;
}

export interface WalletDtoSeller {
  id: number;
  balance: number;
  availableBalance: number;
  customerDTO: any;
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
  name?: string;
  color?: string;
  cut?: string;
  clarity?: string;
  quantity: number;
  settingType: string;
  dimension?: string;
  shape: string;
  certificate: any;
  fluorescence: any;
  lengthWidthRatio?: string;
  type: any;
  jewelryId: number;
  documentDiamonds: DocumentDiamond[];
  imageDiamonds: ImageDiamond[];
}

export interface DocumentDiamond {
  documentLink: string;
  documentTitle: string;
  diamondId: any;
}

export interface ImageDiamond {
  imageLink: string;
  diamondId: any;
}

export interface SecondaryDiamond {
  id: number;
  name: any;
  color?: string;
  cut: any;
  clarity?: string;
  quantity: number;
  settingType?: string;
  dimension: any;
  shape: any;
  certificate: any;
  fluorescence: any;
  lengthWidthRatio: any;
  type: any;
  jewelryId: number;
  documentDiamonds: DocumentDiamond2[];
  imageDiamonds: ImageDiamond2[];
}

export interface DocumentDiamond2 {
  documentLink: string;
  documentTitle: string;
  diamondId: any;
}

export interface ImageDiamond2 {
  imageLink: string;
  diamondId: any;
}

export interface MainShaphy {
  id: number;
  name: any;
  color: string;
  carat: any;
  enhancementType: any;
  quantity: number;
  settingType: any;
  dimension: string;
  jewelryId: number;
  documentShaphies: DocumentShaphy[];
  imageShaphies: ImageShaphy[];
}

export interface DocumentShaphy {
  documentLink: string;
  documentTitle: string;
  shaphieId: any;
}

export interface ImageShaphy {
  imageLink: string;
  shaphieId: any;
}

export interface SecondaryShaphy {
  id: number;
  name: any;
  color: string;
  carat: any;
  enhancementType: any;
  quantity: number;
  settingType: any;
  dimension: any;
  jewelryId: number;
  documentShaphies: DocumentShaphy2[];
  imageShaphies: ImageShaphy2[];
}

export interface DocumentShaphy2 {
  documentLink: string;
  documentTitle: string;
  shaphieId: any;
}

export interface ImageShaphy2 {
  imageLink: string;
  shaphieId: any;
}

export default {};
