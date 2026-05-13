import { User } from "./modelTypes";

export type LoginValues = {
    email: string;
    password: string;
  };

export type UpdateUserPayload = Partial<User>;