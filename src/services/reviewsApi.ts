import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: baseQueryWithReauth,
  //tagTypes: ['Reviews', 'Products', 'ProductsById'],
  endpoints: (builder) => ({
    addProductReview: builder.mutation({
      query: ({ productServiceId, userId, rating, comment }) => ({
        url: `productReview/`,
        method: 'POST',
        body: { productServiceId, userId, rating, comment },
      }),
  //     invalidatesTags: [
  //       { type: 'Products' },
  //       { type: 'ProductsById' },
  // ],
    }),
  }),
});

export const {
  useAddProductReviewMutation,
} = reviewsApi;