export interface ProfileResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: UserInfo;
  errorMessages: any;
}

export interface UserInfo {
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
  bidLimit?: any;
}
// ============================== Dele Account ==============================
export interface DeleteAccountResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: any;
  errorMessages: any;
}
