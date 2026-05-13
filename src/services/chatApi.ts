import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    // ✅ Reemplazar getChatsByUserId con queryFn personalizada
    getChatsByUserId: builder.query({
      queryFn: async (userId, api, extraOptions, baseQuery) => {
        try {
          //console.log('getChatsByUserId - Fetching for user:', userId);
          
          const result = await baseQuery(`chat/conversations/user/${userId}`);
          
          //console.log('getChatsByUserId - Result:', result);
          
          // ✅ Si es exitoso, devolver los datos
          if (result.data) {
            return { data: result.data };
          }
          
          // ✅ Si hay error y es 404, devolver datos vacíos como éxito
          if (result.error) {
            const errorStatus = result.error.status || result.error?.data?.statusCode;
            if (errorStatus === 404) {
              //console.log('No conversations found (404) - returning empty data');
              return {
                data: {
                  success: true,
                  statusCode: 200,
                  message: 'No conversations yet',
                  data: [],
                },
              };
            }
            
            // ✅ Para otros errores, devolver el error tal como está
            //console.error('getChatsByUserId - Real error:', result.error);
            return { error: result.error };
          }
          
          // ✅ Caso fallback - no debería llegar aquí
          console.warn('getChatsByUserId - Unexpected result structure');
          return {
            data: {
              success: true,
              statusCode: 200,
              message: 'No conversations yet',
              data: [],
            },
          };
          
        } catch (error) {
          console.error('getChatsByUserId - Catch error:', error);
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error.message || 'Unknown error',
            },
          };
        }
      },
      providesTags: (result, error, userId) => [
        'Chats',
        { type: 'Chats', id: 'LIST' },
      ],
    }),
    
    getChatById: builder.query({
      query: (id) => `chat/messages/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Messages', id },
        { type: 'Messages', id: 'LIST' },
      ],
    }),
    createChat: builder.mutation({
      query: (chatData) => ({
        url: 'chat/conversation/',
        method: 'POST',
        body: chatData,
      }),
      invalidatesTags: [
        'Chats',
        { type: 'Chats', id: 'LIST' },
      ],
    }),
    updateChat: builder.mutation({
      query: ({ chatId, chatData }) => ({
        url: `chats/${chatId}`,
        method: 'PUT',
        body: chatData,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Messages', id: chatId },
        'Chats',
      ],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: 'chat/message',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        'Chats',
      ],
    }),
    addReaction: builder.mutation({
      query: (reactionData) => ({
        url: 'chat/reaction',
        method: 'POST',
        body: reactionData,
      }),
      invalidatesTags: (result, error, { reactableId }) => {
        return [
          { type: 'Messages', id: 'LIST' },
        ];
      },
    }),
  }),
});

export const {
  useGetChatsByUserIdQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useSendMessageMutation,
  useAddReactionMutation,
} = chatApi;