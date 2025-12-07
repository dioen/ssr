import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ProductItem } from '../product-item/ProductItem.js';
import { Pagination } from '../pagination/Pagination.js';
import { ProductsFilter } from '../products-filter/ProductsFilter.js';
import { usePaginationRedirect } from '../hooks/usePaginationRedirect.js';
import {
  fetchProducts,
  ProductEdit,
  ProductsApiResponse,
  updateProduct,
} from '../helpers.js';
import { PRODUCTS_CACHE_TTL_MS } from '../../../consts.js';
import { ProductsPlaceholder } from '../products-placeholder/ProductsPlaceholder.js';
import { ProductEditModal } from '../product-edit-modal/ProductEditModal';
import { useNotification } from '../../../contexts/use-notification/useNotification';

export const ProductsList = () => {
  const { addNotification } = useNotification();
  const [searchParams] = useSearchParams();
  const [editingProduct, setEditingProduct] =
    React.useState<ProductEdit | null>(null);

  const { data, isFetching, refetch } = useQuery<ProductsApiResponse>({
    queryKey: ['products', searchParams.toString()],
    queryFn: () => fetchProducts(searchParams),
    staleTime: PRODUCTS_CACHE_TTL_MS,
    gcTime: PRODUCTS_CACHE_TTL_MS,
  });

  const products = data?.products || [];

  usePaginationRedirect(data?.productsCount);

  const handleEditProduct = (id: number) => {
    const product = products.find((product) => product.id === id);

    if (!product) return;

    setEditingProduct(product || null);
  };

  const handleProudctEditSave = async (
    newEditingProduct: Partial<ProductEdit>
  ) => {
    // TODO: add is loading state handling
    updateProduct(
      { ...editingProduct, ...newEditingProduct },
      addNotification
    ).then(() => {
      setEditingProduct(null);
      refetch();
    });
  };

  const handleEditModalClose = () => {
    setEditingProduct(null);
  };

  return (
    <div className="w-full">
      <ProductsFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isFetching && <ProductsPlaceholder />}

        {!isFetching &&
          (!!products.length ? (
            products.map((product) => (
              <ProductItem
                key={product.id}
                {...product}
                refetchProducts={refetch}
                onEdit={handleEditProduct}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg py-8">
              No products found.
            </div>
          ))}
      </div>

      {!!data?.productsCount && (
        <Pagination itemsCount={data?.productsCount || 0} />
      )}

      {!!editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={handleEditModalClose}
          onSave={handleProudctEditSave}
        />
      )}
    </div>
  );
};
