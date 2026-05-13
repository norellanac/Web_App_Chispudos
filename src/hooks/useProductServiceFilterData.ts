import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductService, Category } from '../types/api/modelTypes';
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
  resetFilters,
  clearFilters,
} from '../redux/slices/filterProductsSlice';
import { useGetProductsQuery } from '../services/productApi';

export const useProductServiceFilterData
 = () => {
  const { data } = useGetProductsQuery();
  const servicesData: ProductService[] = data?.data?.items || [];
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter.options);

  // Update filter functions
  const updateSearchTerm = useCallback((searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm));
  }, [dispatch]);

  const updatePriceRange = useCallback((min: number | null, max: number | null) => {
    dispatch(setPriceRange({ min, max }));
  }, [dispatch]);

  const updateCategories = useCallback((categories: number[]) => {
    dispatch(setCategories(categories));
  }, [dispatch]);

  const updateLocations = useCallback((locationIds: number[]) => {
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

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Apply all filters
  const filteredServices = useMemo(() => {
    // Start with all services
    let result = [...servicesData];

    // Apply text search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(service => 
        service.name.toLowerCase().includes(searchLower) || 
        service.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply price range filter
    if (filters.priceRange.min !== null) {
      result = result.filter(service => service.price >= (filters.priceRange.min || 0));
    }
    if (filters.priceRange.max !== null) {
      result = result.filter(service => service.price <= (filters.priceRange.max || Infinity));
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(service => 
        service.categories.some(category => filters.categories.includes(category.id))
      );
    }

    // Apply location filter
    if (filters.locationIds.length > 0) {
      result = result.filter(service => 
        service.locations.some(location => filters.locationIds.includes(location.cityId))
      );
    }

    // Apply rating filter
    if (filters.minRating !== null) {
      result = result.filter(service => service.averageRating >= (filters.minRating || 0));
    }

    // Apply type filter
    if (filters.type !== null) {
      result = result.filter(service => service.type === filters.type);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'newest':
          result.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    return result;
  }, [servicesData, filters]);

  // Extracting available filters from data
  const availableCategories = useMemo(() => {
    const categoryMap = new Map<number, Category>();
    servicesData.forEach(service => {
      service.categories.forEach(category => {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, category);
        }
      });
    });
    return Array.from(categoryMap.values());
  }, [servicesData]);

  const availableLocations = useMemo(() => {
    const locationMap = new Map<number, { id: number, name: string }>();
    servicesData.forEach(service => {
      service.locations.forEach(location => {
        if (!locationMap.has(location.cityId)) {
          locationMap.set(location.cityId, { 
            id: location.cityId, 
            name: location.description || '',
            description: location.description || '',
            cityName: location.city?.name || '',
          });
        }
      });
    });
    return Array.from(locationMap.values());
  }, [servicesData]);

  const priceRange = useMemo(() => {
    if (servicesData.length === 0) return { min: 0, max: 0 };
    
    let min = servicesData[0].price;
    let max = servicesData[0].price;
    
    servicesData.forEach(service => {
      if (service.price < min) min = service.price;
      if (service.price > max) max = service.price;
    });
    
    return { min, max };
  }, [servicesData]);

  return {
    filteredServices,
    filters,
    updateSearchTerm,
    updatePriceRange,
    updateCategories,
    updateLocations,
    updateMinRating,
    updateSortBy,
    updateType,
    resetFilters: handleResetFilters,
    clearFilters: handleClearFilters,
    availableCategories,
    availableLocations,
    priceRange,
    totalCount: servicesData.length,
    filteredCount: filteredServices.length
  };
};