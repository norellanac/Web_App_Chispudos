import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { BrandingConfig } from '../../types/branding';

export const fetchBranding = createAsyncThunk('branding/fetch', async () => {
  const baseUrl = (import.meta.env.VITE_BASE_API_URL || '').replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/branding`);
  const json = await response.json();
  return json.data as BrandingConfig;
});

type BrandingState = {
  config: BrandingConfig | null;
  isLoaded: boolean;
  isLoading: boolean;
};

const initialState: BrandingState = {
  config: null,
  isLoaded: false,
  isLoading: false,
};

const brandingSlice = createSlice({
  name: 'branding',
  initialState,
  reducers: {
    setBranding(state, action: PayloadAction<BrandingConfig>) {
      state.config = action.payload;
      state.isLoaded = true;
      state.isLoading = false;
    },
    clearBranding(state) {
      state.config = null;
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBranding.fulfilled, (state, action) => {
        state.config = action.payload;
        state.isLoaded = true;
        state.isLoading = false;
      })
      .addCase(fetchBranding.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setBranding, clearBranding } = brandingSlice.actions;
export const selectBranding = (state: RootState) => state.branding;
export default brandingSlice.reducer;
