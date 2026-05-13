import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import {
  LoginResponse,
} from '../../types/api/apiResponses';
import { User } from '../../types/api/modelTypes';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User
  error: string | null;
  
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: {} as User,
  token: null,
  refreshToken: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      state.isAuthenticated = true;
      // Handle response structure { success: true, message: "Success", data: { user, accessToken, refreshToken } }
      const payload = action.payload.data || action.payload;
      state.user = payload.user;
      state.token = payload.accessToken || payload.token; // Changed to check both accessToken and token
      state.refreshToken = payload.refreshToken || null;
      state.error = null;
    },
    updateTokens(state, action: PayloadAction<{ accessToken?: string; token?: string; refreshToken: string }>) {
      state.token = action.payload.accessToken || action.payload.token || state.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setAuthUserState(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = {} as User;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = {} as User;
      state.error = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { loginSuccess, updateTokens, setAuthUserState, loginFailure, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;