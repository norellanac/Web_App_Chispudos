import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';
import { ApiResponseType } from '../types/api/apiResponses';

// order status constants
// 1: requested, 2: in progress, 3: completed, 4: cancelled, 5: refunded, 6: failed, 7: reviewed

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponseType<[]>, void>({
      query: () => 'orders/',
      providesTags: ['Order'],
    }),
    getOrdersByUserId: builder.query<ApiResponseType<[]>, number>({
      query: (userId) => `orders/user/${userId}`,
      providesTags: ['Order'],
    }),
    getOrdersByMerchantId: builder.query<ApiResponseType<[]>, number>({
      query: (userId) => `orders/merchant/${userId}`,
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
        query: (body) => ({
          url: 'orders/',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Order'],
      }),
    updateOrder: builder.mutation({
      query: ({ orderId, status }: { orderId: number; status: number }) => ({
        url: `orders/${orderId}/`,
        method: 'PUT',
        body: { status }, // Ensure the status is sent in the body
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
    useGetOrdersQuery,
    useGetOrdersByUserIdQuery,
    useGetOrdersByMerchantIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
} = ordersApi;