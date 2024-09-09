export interface DataSignUpResponse {
  firstName: string;
  lastName: string;
  profilePicture: string;
  email: string;
  gender: string;
  address: string;
  passwordHash: string;
  status: boolean;
  phoneNumber: string;
  confirmationToken: string;
  isConfirmed: boolean;
  vnPayAccount?: string;
  vnPayBankCode?: string;
  vnPayAccountName?: string;
  roleId: number;
  roleName: string;
}

export interface SignUpUser {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  gender: string;
  phoneNumber: string;
}
