// types/authTypes.ts

export interface UserAccount {
  $id?: string;
  email: string;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: CustomerDto;
  staffDTO?: any;
}

export interface CustomerDto {
  $id?: string;
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
  accountDTO?: AccountDto;
}

export interface AccountDto {
  $ref?: string;
}

export interface Data {
  $id?: string;
  user: UserAccount;
  accessToken: string;
}
export interface LoginResponse {
  $id?: string;
  code: number;
  message: string;
  isSuccess: boolean;
  data: Data;
  errorMessages?: any;
}
