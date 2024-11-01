// utils/ApiError.ts
export class ApiError extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

// Define the structure of the API response
export interface ApiResponse {
  isSuccess: boolean;
  message: string;
  code?: number;
  data?: any;
  errorMessages?: any;
}
