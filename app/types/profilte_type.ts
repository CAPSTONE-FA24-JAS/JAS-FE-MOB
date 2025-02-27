export interface ProfileResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: UserInfo;
  errorMessages: any;
}

export interface UserInfo {
  id: number;
  email: string;
  phoneNumber: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: CustomerDto;
  staffDTO: any;
}

export interface CustomerDto {
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
  accountDTO: any;
}

export interface WalletDto {
  id: number;
  balance: number;
  availableBalance: number;
  frozenBalance: number;
  customerDTO: any;
}

// ============================== Dele Account ==============================
export interface DeleteAccountResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: any;
  errorMessages: any;
}

export default {};
