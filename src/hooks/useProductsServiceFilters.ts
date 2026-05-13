import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../redux/store/store';
import {
  FilterOptions,
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
} from '../redux/slices/filterProductsSlice';

/**
 * Hook for accessing and managing filter state across components
 * This hook provides access to the current filter state and all filter actions
 */
export const useProductsServiceFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter.options);

  // Individual filter update functions
  const updateSearchTerm = useCallback((searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm));
  }, [dispatch]);

  const updatePriceRange = useCallback((min: number | null, max: number | null) => {
    dispatch(setPriceRange({ min, max }));
  }, [dispatch]);

  const updateCategories = useCallback((categories: number[]) => {
    dispatch(setCategories(categories));
  }, [dispatch]);

  const updateLocationIds = useCallback((locationIds: number[]) => {
    dispatch(setLocationIds(locationIds));
  }, [dispatch]);

  const updateMinRating = useCallback((minRating: number | null) => {
    dispatch(setMinRating(minRating));
  }, [dispatch]);

  const updateSortBy = useCallback((sortBy: FilterOptions['sortBy']) => {
    dispatch(setSortBy(sortBy));
  }, [dispatch]);

  const updateType = useCallback((type: number | null) => {
    dispatch(setType(type));
  }, [dispatch]);

  // Bulk filter update
  const updateFilters = useCallback((partialFilters: Partial<FilterOptions>) => {
    dispatch(setFilters(partialFilters));
  }, [dispatch]);

  // Reset filters to initial state
  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Clear filters (alias for reset)
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return {
    // Current filter state
    filters,
    
    // Individual update functions
    updateSearchTerm,
    updatePriceRange,
    updateCategories,
    updateLocationIds,
    updateMinRating,
    updateSortBy,
    updateType,
    
    // Bulk update
    updateFilters,
    
    // Reset/clear functions
    resetFilters: handleResetFilters,
    clearFilters: handleClearFilters,
  };
};
