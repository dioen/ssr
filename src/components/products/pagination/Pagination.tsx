import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductsApiFilters } from '../helpers';
import { PRODUCTS_PER_PAGE_DEFAULT } from '../../../consts';

interface PaginationProps {
  itemsCount: number;
}

export const countTotalPages = (itemsCount: number, itemsPerPage: number) =>
  Math.ceil(itemsCount / itemsPerPage);

export const Pagination: React.FC<PaginationProps> = ({ itemsCount }) => {
  const totalPages = countTotalPages(itemsCount, PRODUCTS_PER_PAGE_DEFAULT);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = React.useState(
    searchParams.get(ProductsApiFilters.PAGE)
      ? parseInt(searchParams.get(ProductsApiFilters.PAGE) as string, 10)
      : 1
  );

  const handlePreviousButtonClick = () => {
    if (currentPage > 1) {
      const page = currentPage - 1;

      setCurrentPage(page);
      setSearchParams({
        ...Object.fromEntries(searchParams),
        [ProductsApiFilters.PAGE]: page.toString(),
      });
    }
  };

  const handleNextButtonClick = () => {
    const page = currentPage + 1;

    if (page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({
        ...Object.fromEntries(searchParams),
        [ProductsApiFilters.PAGE]: page.toString(),
      });
    }
  };

  React.useEffect(() => {
    const pageStr = searchParams.get(ProductsApiFilters.PAGE);
    const page = pageStr ? parseInt(pageStr, 10) : 1;

    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handlePreviousButtonClick}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>

      <span className="px-4 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNextButtonClick}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};
