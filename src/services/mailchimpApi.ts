import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mailchimpApi = createApi({
  reducerPath: 'mailchimpApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_MAILCHIMP_API_URL,
    prepareHeaders: (headers) => {
      headers.set(
        'Authorization',
        `Basic anystring:${import.meta.env.VITE_MAILCHIMP_API_KEY}`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation({
      query: (email: string) => ({
        url: `/lists/${import.meta.env.VITE_MAILCHIMP_LIST_ID}/members`,
        method: 'POST',
        body: {
          email_address: email,
          status: 'subscribed',
        },
      }),
    }),
  }),
});

export const { useSubscribeToNewsletterMutation } = mailchimpApi;