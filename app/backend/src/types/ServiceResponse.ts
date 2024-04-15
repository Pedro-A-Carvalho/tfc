type ErrorResponse = {
  status: 400 | 401 | 404 | 422;
  data: { message: string };
};

type SuccessResponse<T> = {
  status: 200 | 201;
  data: T;
};

export type SimpleServiceResponse = {
  status: 200 | 201;
  data: { [key:string]: string };
} | ErrorResponse;

export type LoginResponse = {
  status: number;
  data: { token: string };
} | ErrorResponse;

export type ServiceResponse<T> = ErrorResponse | SuccessResponse<T>;
