import { User } from "./modelTypes";

export type UserResponseType = {
  success: boolean;
  message: string;
  data: User;
};

export type LoginResponse = {
  user: User;
  token: string;
  refreshToken?: string;
};

export type SuccessResponseType<T> = {
  success: true;
  message: string;
  data: T;
};

export type ErrorResponseType = {
  success: false;
  message: string;
  error: string;
};

export type ApiResponseType<T> = SuccessResponseType<T> | ErrorResponseType;