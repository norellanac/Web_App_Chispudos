import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponseType, CategoryType } from '../types/api/apiResponses';
import baseQueryWithReauth from './baseQueryWithReauth';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponseType<CategoryType[]>, void>({
      query: () => 'public/categories/',
    }),
  }),
});

export const {
  useGetCategoriesQuery,
} = categoryApi;