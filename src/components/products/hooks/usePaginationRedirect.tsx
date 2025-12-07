import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductsApiFilters } from '../helpers.js';
import { countTotalPages } from '../pagination/Pagination.js';
import { PRODUCTS_PER_PAGE_DEFAULT } from '../../../consts.js';

// Hook to redirect to first page if current page exceeds total pages
export const usePaginationRedirect = (productsCount: number | undefined) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // page variable for linting purpose only
  const page = searchParams.get(ProductsApiFilters.PAGE);

  React.useEffect(() => {
    if (productsCount !== undefined) {
      const currentPageStr = searchParams.get(ProductsApiFilters.PAGE);
      const currentPage = currentPageStr ? Number(currentPageStr) : 1;
      const totalPages = countTotalPages(
        productsCount || 0,
        PRODUCTS_PER_PAGE_DEFAULT
      );

      if (currentPage > totalPages) {
        setSearchParams({
          ...Object.fromEntries(searchParams),
          [ProductsApiFilters.PAGE]: '1',
        });
      }
    }
  }, [page, productsCount, setSearchParams]);
};
