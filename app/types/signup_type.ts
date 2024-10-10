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
  email: string;
  passwordHash: string;
  phoneNumber: string;
  registerCustomerDTO: registerCustomer;
}

export interface registerCustomer {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  citizenIdentificationCard?: string;
  idIssuanceDate?: string;
  idExpirationDate?: string;
}
