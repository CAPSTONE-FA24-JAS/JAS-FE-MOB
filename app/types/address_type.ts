// ========= get list address of custormer ==============
export type AddressListResponse = {
  code: number;
  message: string;
  isSuccess: boolean;
  data: AddressListData[];
  errorMessages: string[] | null;
};

export type AddressListData = {
  id: number;
  addressLine: string;
  customerId?: number;
  isDefault: boolean | null;
};

// =========== api GHN ==============

// Get list of provinces
export interface ListProvinceResponse {
  code: number;
  message: string;
  data: ListProvinceData[];
}

export interface ListProvinceData {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt?: string;
  AreaID?: number;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedIP?: string;
  UpdatedEmployee?: number;
  UpdatedSource?: string;
  UpdatedDate?: string;
}

// Get list districts by province

export interface ListDistrictReponse {
  code: number;
  message: string;
  data: ListDistrictData[];
}

export interface ListDistrictData {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
  NameExtension: string[];
  IsEnable?: number;
  CanUpdateCOD: boolean;
  Status: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: WhiteListClient;
  WhiteListDistrict: WhiteListDistrict;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates?: string[];
  CreatedIP?: string;
  CreatedEmployee?: number;
  CreatedSource?: string;
  CreatedDate?: string;
  UpdatedEmployee: number;
  UpdatedDate: string;
  UpdatedBy?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DistrictEncode?: string;
}

export interface WhiteListClient {
  From: any[];
  To: any[];
  Return: any[];
}

export interface WhiteListDistrict {
  From: any;
  To: any;
}

// Get list wards by district

export interface ListWardResponse {
  code: number;
  message: string;
  data: ListWardData[];
}

export interface ListWardData {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  CanUpdateCOD: boolean;
  SupportType: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: WhiteListClient;
  WhiteListWard: WhiteListWard;
  Status: number;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates?: string[];
  CreatedIP: string;
  CreatedEmployee: number;
  CreatedSource: string;
  CreatedDate: string;
  UpdatedEmployee: number;
  UpdatedDate: string;
}

export interface WhiteListClient {
  From: any[];
  To: any[];
  Return: any[];
}

export interface WhiteListWard {
  From: any;
  To: any;
}

export default {};
