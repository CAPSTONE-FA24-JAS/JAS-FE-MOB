// types/authTypes.ts

export interface UserAccount {
  firstName: string;
  lastName: string;
  profilePicture: any;
  email: string;
  gender: string;
  dateOfBirth: any;
  address: any;
  passwordHash?: string;
  status?: boolean;
  phoneNumber?: string;
  confirmationToken?: string;
  isConfirmed?: boolean;
  vnPayAccount?: any;
  vnPayBankCode?: any;
  vnPayAccountName?: any;
  roleId: number;
  role?: any;
  blogs?: any;
  bidLimit?: any;
  wallet?: any;
  id: number;
  creationDate?: string;
  createdBy?: number;
  modificationDate?: string;
  modificationBy?: number;
  deletionDate?: any;
  deleteBy?: any;
  isDeleted?: boolean;
}

export interface Data {
  user: UserAccount;
  accessToken: string;
}
export interface LoginResponse {
  code: number;
  message: string;
  isSuccess: boolean;
  data: Data;
  errorMessages: any;
}
