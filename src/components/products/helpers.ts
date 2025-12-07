import { PRODUCTS_PER_PAGE_DEFAULT } from '../../consts.js';

export interface ProductEdit {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface ProductsApiResponse {
  products: Product[];
  productsCount: number;
}

export interface FiltersResponse {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export const ProductsApiFilters = {
  TITLE: 'title',
  PRICE_MIN: 'price_min',
  PRICE_MAX: 'price_max',
  CATEGORY_ID: 'categoryId',
  OFFSET: 'offset',
  PAGE: 'page',
  LIMIT: 'limit',
} as const;

export const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(
    `${typeof process !== 'undefined' ? process.env.VITE_API_BASE_URL : import.meta.env.VITE_API_BASE_URL}/products/${id}`
  );
  return response.json();
};

export const fetchCategories = async (): Promise<FiltersResponse[]> => {
  const response = await fetch(
    `${typeof process !== 'undefined' ? process.env.VITE_API_BASE_URL : import.meta.env.VITE_API_BASE_URL}/categories`
  );
  return response.json();
};

// Fetch products from API with given search parameters
// API is not providing total count based on filters
// therefore we need to fetch filtered products twice:
// 1. with pagination to get products for current page
// 2. without pagination to get total count of filtered products
export const fetchProducts = async (
  urlSearchParams: URLSearchParams
): Promise<ProductsApiResponse> => {
  const _urlSearchParams = validateAndBuildApiQueryString(urlSearchParams);
  const _urlSearchParamsWithoutPagination = validateAndBuildApiQueryString(
    urlSearchParams,
    true
  );
  const productsUrlWithoutPagination = `${typeof process !== 'undefined' ? process.env.VITE_API_BASE_URL : import.meta.env.VITE_API_BASE_URL}/products`;
  const filteredProductsUrl = `${productsUrlWithoutPagination}?${_urlSearchParams}`;
  const filteredProductsUrlWithoutPagination = `${productsUrlWithoutPagination}?${_urlSearchParamsWithoutPagination}`;

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await Promise.all([
    fetch(filteredProductsUrl).then((res) => res.json()),
    fetch(filteredProductsUrlWithoutPagination).then((res) => res.json()),
  ]);

  return {
    products: response[0],
    productsCount: response[1].length,
  };
};

export const createProduct = async (
  productData: Omit<ProductEdit, 'id' | 'categoryId'> & { categoryId: string },
  reset: () => void,
  navigate: (path: string) => void,
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void
) => {
  try {
    const response = await fetch('/products/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      addNotification(
        `Failed to create product: ${errorData.error || 'Unknown error'}`,
        'error'
      );
    } else {
      reset();
      navigate('/products');
      addNotification('Product created successfully', 'success');
    }
  } catch (error) {
    addNotification(`Error creating product: ${error}`, 'error');
  }
};

export const updateProduct = async (
  updateData: Partial<ProductEdit>,
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void
) => {
  try {
    const response = await fetch(`/products/${updateData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      addNotification(
        `Failed to update product: ${errorData.error || 'Unknown error'}`,
        'error'
      );
    } else {
      addNotification('Product updated successfully', 'success');
    }
  } catch (error) {
    addNotification(`Error updating product: ${error}`, 'error');
  }
};

export const deleteProduct = async (
  id: string,
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void,
  refetchProducts: () => void
) => {
  if (window.confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch('/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addNotification(
          `Failed to delete product: ${errorData.error || 'Unknown error'}`,
          'error'
        );
      } else {
        refetchProducts();
        addNotification('Product deleted successfully', 'success');
      }
    } catch (error) {
      addNotification(`Error deleting product: ${error}`, 'error');
    }
  }
};

export const validateAndBuildApiQueryString = (
  params: URLSearchParams,
  withoutPagination?: boolean
): string => {
  const searchParams = new URLSearchParams();
  const title = params.get(ProductsApiFilters.TITLE);

  if (title && title.trim() !== '') {
    searchParams.append(ProductsApiFilters.TITLE, title.trim());
  }

  const priceMinStr = params.get(ProductsApiFilters.PRICE_MIN);
  const priceMaxStr = params.get(ProductsApiFilters.PRICE_MAX);
  const priceMin = priceMinStr ? Number(priceMinStr) : undefined;
  const priceMax = priceMaxStr ? Number(priceMaxStr) : undefined;

  if (
    typeof priceMin === 'number' &&
    typeof priceMax === 'number' &&
    !isNaN(priceMin) &&
    !isNaN(priceMax) &&
    priceMin > 0 &&
    priceMax > 0 &&
    priceMax >= priceMin
  ) {
    searchParams.append(ProductsApiFilters.PRICE_MIN, priceMin.toString());
    searchParams.append(ProductsApiFilters.PRICE_MAX, priceMax.toString());
  }

  const categoryId = params.get(ProductsApiFilters.CATEGORY_ID);

  if (categoryId && categoryId.trim() !== '') {
    searchParams.append(ProductsApiFilters.CATEGORY_ID, categoryId.trim());
  }

  if (!withoutPagination) {
    const currentPageStr = params.get(ProductsApiFilters.PAGE);
    const currentPage = currentPageStr ? Number(currentPageStr) : undefined;

    if (
      typeof currentPage === 'number' &&
      !isNaN(currentPage) &&
      currentPage > 0
    ) {
      searchParams.append(
        ProductsApiFilters.OFFSET,
        ((currentPage - 1) * PRODUCTS_PER_PAGE_DEFAULT).toString()
      );
    } else {
      searchParams.append(ProductsApiFilters.OFFSET, '0');
    }

    const limitStr = params.get(ProductsApiFilters.LIMIT);
    const limit = limitStr ? Number(limitStr) : undefined;

    if (typeof limit === 'number' && !isNaN(limit) && limit > 0) {
      searchParams.append(ProductsApiFilters.LIMIT, limit.toString());
    } else {
      searchParams.append(
        ProductsApiFilters.LIMIT,
        PRODUCTS_PER_PAGE_DEFAULT.toString()
      );
    }
  }

  return searchParams.toString();
};
