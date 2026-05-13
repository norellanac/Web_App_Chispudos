import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponseType } from '../types/api/apiResponses';
import { LoginValues } from '../types/api/apiRequests';
import baseQueryWithReauth from './baseQueryWithReauth';
import { User } from '../types/api/modelTypes';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponseType<{ user: User; token: string; refreshToken: string }>,
      LoginValues
    >({
      query: (credentials) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    requestPasswordReset: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: 'request-password-reset/',
        method: 'POST',
        body,
      }),
    }),
    updatePassword: builder.mutation<
      void,
      { otp: string; newPassword: string }
    >({
      query: (body) => ({
        url: 'reset-password/',
        method: 'POST',
        body,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: 'register/',
        method: 'POST',
        body: userData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRequestPasswordResetMutation,
  useUpdatePasswordMutation,
  useSignupMutation,
} = authApi;