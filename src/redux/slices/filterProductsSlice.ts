import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FilterOptions = {
  searchTerm: string;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  categories: number[];
  locationIds: number[];
  minRating: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest' | null;
  type: number | null;
};

const initialFilterOptions: FilterOptions = {
  searchTerm: '',
  priceRange: {
    min: null,
    max: null,
  },
  categories: [],
  locationIds: [],
  minRating: null,
  sortBy: null,
  type: null,
};

interface FilterState {
  options: FilterOptions;
}

const initialState: FilterState = {
  options: initialFilterOptions,
};

const filterProductsSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.options.searchTerm = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.options.priceRange = action.payload;
    },
    setCategories: (state, action: PayloadAction<number[]>) => {
      state.options.categories = action.payload;
    },
    setLocationIds: (state, action: PayloadAction<number[]>) => {
      state.options.locationIds = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number | null>) => {
      state.options.minRating = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterOptions['sortBy']>) => {
      state.options.sortBy = action.payload;
    },
    setType: (state, action: PayloadAction<number | null>) => {
      state.options.type = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.options = { ...state.options, ...action.payload };
    },
    resetFilters: (state) => {
      state.options = initialFilterOptions;
    },
    clearFilters: (state) => {
      state.options = initialFilterOptions;
    },
  },
});

export const {
  setSearchTerm,
  setPriceRange,
  setCategories,
  setLocationIds,
  setMinRating,
  setSortBy,
  setType,
  setFilters,
  resetFilters,
  clearFilters,
} = filterProductsSlice.actions;

export default filterProductsSlice.reducer;
