import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';
import { ApiResponseType } from '../types/api/apiResponses';

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getStates: builder.query<ApiResponseType<[]>, void>({
      query: () => 'public/states',
    }),
    getAllCities: builder.query<ApiResponseType<[]>, void>({
      query: () => 'public/cities',
    }),
    getCities: builder.query<ApiResponseType<[]>, void>({
      query: (stateId) => `public/states/${stateId}/cities`,
    }),
  }),
});

export const {
    useGetStatesQuery,
    useGetCitiesQuery,
    useGetAllCitiesQuery,
} = locationsApi;