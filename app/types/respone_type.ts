export interface Response<T> {
  code: number;
  message: string;
  isSuccess: boolean;
  data: T;
  errorMessages: string;
}

export interface ResponseList<T> {
  dataResponse: T[];
  totalItemRepsone: number;
}

export default {};
