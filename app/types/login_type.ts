// types/authTypes.ts

export interface UserAccount {
  $id?: string;
  id: number;
  email: string | null;
  gender: any;
  passwordHash: string;
  roleId: number;
  roleName: string;
  customerDTO: CustomerDTO;
  staffDTO?: any;
}

export interface CustomerDTO {
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
