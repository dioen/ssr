import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductsApiFilters } from '../../helpers';

export interface Filters {
  title: string;
  categoryId: string;
  price_min: number | null;
  price_max: number | null;
  page: string;
}

// Hook to manage filters state
export const useFilters = () => {
  const [searchParams] = useSearchParams();

  const initialFilters: Filters = {
    title: searchParams.get(ProductsApiFilters.TITLE) || '',
    categoryId: searchParams.get(ProductsApiFilters.CATEGORY_ID) || '',
    price_min: searchParams.get(ProductsApiFilters.PRICE_MIN)
      ? Number(searchParams.get(ProductsApiFilters.PRICE_MIN))
      : null,
    price_max: searchParams.get(ProductsApiFilters.PRICE_MAX)
      ? Number(searchParams.get(ProductsApiFilters.PRICE_MAX))
      : null,
    page: searchParams.get(ProductsApiFilters.PAGE) || '',
  };

  const [filters, setFilters] = React.useState<Filters>(initialFilters);

  const updateFilter = (key: keyof Filters, value: Filters[keyof Filters]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    updateFilter,
  };
};
