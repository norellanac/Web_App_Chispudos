import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '../redux/store/store';
import { selectAuth, logout, updateTokens } from '../redux/slices/authSlice';
import { logger } from '../utils/logger';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: (import.meta.env.VITE_BASE_API_URL || '').endsWith('/')
    ? import.meta.env.VITE_BASE_API_URL
    : `${import.meta.env.VITE_BASE_API_URL}/`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    // Access token directly via slice name
    const token = state.auth?.token;
    console.log('DEBUG: [prepareHeaders] Token from State:', token ? 'Value Present' : 'is NULL/Undefined');
    if (token) {
      const formattedToken = token.startsWith('Bearer ') 
        ? token 
        : `Bearer ${token}`;
      
      headers.set('Authorization', formattedToken);
      console.log('DEBUG: [prepareHeaders] Authorization Header set');
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  
  // 1. Log request
  console.log(`DEBUG: [baseQueryWithReauth] Start ${url}`, {
    token: (api.getState() as RootState).auth.token ? 'Present' : 'Missing',
  });
  logger('info', { message: `==REQUEST==: ${url}`, args });

  // 2. Initial request - wait if a refresh is already happening
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  
  console.log(`DEBUG: [baseQueryWithReauth] Result from ${url}:`, {
    status: result.error?.status,
    data: result.data ? 'Present' : 'Missing',
  });

  // 3. Monitor for 401 Unauthorized, 403 Forbidden, or specific message
  const isAuthError =
    result.error?.status === 401 ||
    result.error?.status === 403 ||
    (result.error?.data &&
      typeof result.error.data === 'object' &&
      'message' in result.error.data &&
      ((result.error.data as { message: string }).message === 'Token not found in database' ||
       (result.error.data as { message: string }).message === 'Unauthorized'));

  // Exclude login/ and refresh/ endpoint from auto-refresh logic to avoid logout loops
  const isExcluded = url.includes('/login') || url.includes('/refresh');

  if (isAuthError && !isExcluded) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        logger('info', { message: '==AUTH==: Refreshing token...' });
        const authState = selectAuth(api.getState() as RootState);
        const refreshToken = authState.refreshToken;

        if (refreshToken) {
          // Perform the refresh call
          const refreshResult = await baseQuery(
            {
              url: 'auth/refresh/', 
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            // Adjusting extraction based on confirmed response structure { success, message, data: { accessToken, refreshToken } }
            const resultData = (refreshResult.data as any).data || refreshResult.data;
            const newToken = resultData.accessToken;
            const newRefreshToken = resultData.refreshToken;

            if (newToken && newRefreshToken) {
              api.dispatch(updateTokens({ accessToken: newToken, refreshToken: newRefreshToken }));
              logger('info', { message: '==AUTH==: Token refreshed successfully' });
              
              // Retry the original request
              result = await baseQuery(args, api, extraOptions);
            } else {
              logger('error', { message: '==AUTH==: Refresh response missing tokens', data: refreshResult.data });
              api.dispatch(logout());
            }
          } else {
            logger('error', { message: '==AUTH==: Refresh call failed, logging out' });
            api.dispatch(logout());
          }
        } else {
          logger('error', { message: '==AUTH==: No refresh token available, logging out' });
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Wait for existing refresh and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  // 4. Final error logging if the final retried request still fails
  if (result.error) {
    logger('error', { message: `==ERROR==: FINAL FAIL - ${url}`, error: result.error });
  }

  return result;
};

export default baseQueryWithReauth;