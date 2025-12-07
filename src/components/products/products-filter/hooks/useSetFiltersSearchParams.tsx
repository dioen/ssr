import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from './useFilters';
import { ProductsApiFilters } from '../../helpers';
import { INPUT_DEBOUNCE_MS } from '../../../../consts';

// Hook to synchronize filters state with URL search parameters
export const useSetFiltersSearchParams = (filters: Filters) => {
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const params: Record<string, string | number | null> = {
      [ProductsApiFilters.TITLE]: filters.title || null,
      [ProductsApiFilters.PRICE_MIN]: filters.price_min || null,
      [ProductsApiFilters.PRICE_MAX]: filters.price_max || null,
      [ProductsApiFilters.CATEGORY_ID]: filters.categoryId || null,
    };

    // Create a new URLSearchParams object to avoid mutating the existing one
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    const handler = setTimeout(() => {
      setSearchParams(newSearchParams);
    }, INPUT_DEBOUNCE_MS);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, searchParams, setSearchParams]);
};
