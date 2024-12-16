// ======= Get list lot by auction id ==============
export interface ListLotResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: Lot[];
  errorMessages: any;
}

export interface Lot {
  id: number;
  startPrice?: number;
  endPrice?: number; // chỉ dùng trong phương thức đầu giá ngược
  currentPrice: any;
  title?: string;
  finalPriceSold?: number;
  status: string;
  bidIncrement?: number;
  deposit: number;
  buyNowPrice?: number;
  floorFeePercent: number;
  currentPriceWinner: number;
  startTime: string;
  endTime: string;
  actualEndTime: any;
  isExtend: boolean;
  haveFinancialProof: boolean;
  lotType: string;
  imageLinkJewelry: string;
  sellerId: number;
  staffId: number;
  jewelryId: number;
  auctionId: number;
}

// ============ Get Lot Detail by ID lot ==============

export interface LotDetailResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: LotDetail;
  errorMessages: any;
}

export interface LotDetail {
  buyNowPrice?: number; //Fixed_Price
  id: number;
  status: string;
  deposit: number;
  floorFeePercent: number;
  currentPriceWinner: number;
  bidIncrementTime?: number; //Auction_Price_GraduallyReduced
  startTime: string;
  endTime: string;
  actualEndTime: any;
  isExtend: boolean;
  haveFinancialProof: boolean;
  lotType: string;
  sellerId: number;
  staffId: number;
  jewelryId: number;
  auctionId: number;
  seller: Seller;
  staff: Staff;
  auction: Auction;
  jewelry: Jewelry;
  startPrice?: number; //Auction_Price_GraduallyReduced & Secret_Auction
  finalPriceSold?: any; //Auction_Price_GraduallyReduced & Secret_Auction
  bidIncrement?: number; //Auction_Price_GraduallyReduced
  currentPrice?: any; //Public_Auction
}

export interface Seller {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: any;
  gender: string;
  address: any;
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  gender: string;
  dateOfBirth: string;
  accountDTO: AccountDto;
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

export interface Auction {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  actualEndTime: any;
  description: string;
  imageLink: string;
  status: string;
  totalLot: number;
}

export interface Jewelry {
  id: number;
  name: string;
  description: any;
  estimatePriceMin: number;
  estimatePriceMax: number;
  startingPrice: any;
  specificPrice: number;
  videoLink: any;
  forGender: any;
  title: string;
  bidForm: any;
  time_Bidding: any;
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
  settingType: string;
  dimension: any;
  shape: string;
  certificate: any;
  fluorescence: any;
  lengthWidthRatio: any;
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
  color: string;
  cut: any;
  clarity: string;
  quantity: number;
  settingType: string;
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

export interface Valuation {
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
  cancelReason: any;
  sellerId: number;
  staffId: number;
  creationDate: string;
  seller: Seller2;
  staff: Staff2;
  appraiser: any;
  imageValuations: ImageValuation[];
  valuationDocuments: ValuationDocument[];
  jewelry: any;
}

export interface Seller2 {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: any;
  gender: string;
  dateOfBirth: string;
  address: any;
  citizenIdentificationCard: string;
  idIssuanceDate: string;
  idExpirationDate: string;
  priceLimit: number;
  expireDate: string;
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

export interface Staff2 {
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

// Floor fee type definition
export interface FloorFee {
  from: number | null;
  to: number | null;
  percent: number;
  id: number;
  creationDate: string;
  createdBy: string | null;
  modificationDate: string | null;
  modificationBy: string | null;
  deletionDate: string | null;
  deleteBy: string | null;
  isDeleted: boolean;
}

export interface WinnerForLot {
  currentPrice: number;
  isDeposit: boolean;
  customerId: number;
  lotId: number;
  priceLimit: number;
  isWinner: boolean;
  isRefunded: boolean;
  isInvoiced: boolean;
  expireDateOfBidLimit: string;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture: string;
    gender: string;
    address: string;
  };
}
