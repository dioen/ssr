import { PriceInput } from '../../price-input/PriceInput';
import { useFilters } from './hooks/useFilters';
import {
  fetchCategories,
  FiltersResponse,
  ProductsApiFilters,
} from '../helpers';
import { useSetFiltersSearchParams } from './hooks/useSetFiltersSearchParams';
import { useQuery } from '@tanstack/react-query';

export const ProductsFilter = () => {
  const { data } = useQuery<FiltersResponse[]>({
    queryKey: ['product_categories', 'filters'],
    queryFn: fetchCategories,
    staleTime: 10000, // 10 seconds
    gcTime: 10000, // 10 seconds
  });

  const categories = data || [];

  const { filters, updateFilter } = useFilters();

  useSetFiltersSearchParams(filters);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 mt-4">Filters</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Search by Title:</label>
          <input
            type="text"
            value={filters.title}
            onChange={(e) =>
              updateFilter(ProductsApiFilters.TITLE, e.target.value)
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Filter by Category:</label>
          <select
            value={filters.categoryId}
            onChange={(e) => {
              updateFilter(ProductsApiFilters.CATEGORY_ID, e.target.value);
            }}
            className="border p-2 rounded w-full"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-2">Filter by Price Range:</label>
          <div className="flex space-x-2">
            <PriceInput
              value={filters.price_min}
              placeholder="Min price"
              onChange={(v) => updateFilter(ProductsApiFilters.PRICE_MIN, v)}
            />

            <PriceInput
              value={filters.price_max}
              placeholder="Max price"
              onChange={(v) => updateFilter(ProductsApiFilters.PRICE_MAX, v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
