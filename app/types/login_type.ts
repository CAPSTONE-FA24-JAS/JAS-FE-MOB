// types/authTypes.ts

export interface UserAccount {
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
export interface Data {
  account: UserAccount;
  accessToken: string;
}
export interface LoginResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: Data;
  errorMessages: any;
}
