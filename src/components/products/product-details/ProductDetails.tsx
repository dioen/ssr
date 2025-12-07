import {
  useParams,
  useNavigate,
  // Navigate
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product, fetchProduct } from '../helpers';
import { PRODUCTS_CACHE_TTL_MS } from '../../../consts.js';
import { ProductDetailsPlaceholder } from './product-details-placeholder/ProductDetailsPlaceholder.js';

// Bonus view of Product Details
// This view omits server endpoint proxy and is NOT attaching auth token to the request

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isFetching } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    staleTime: PRODUCTS_CACHE_TTL_MS,
    gcTime: PRODUCTS_CACHE_TTL_MS,
    refetchIntervalInBackground: false,
  });

  // TODO: to make it working it should be handled on server as well
  // if (!product) {
  //   return <Navigate to="/not-found" />;
  // }

  if (isFetching) {
    return (
      <div className="text-center py-8">
        <ProductDetailsPlaceholder />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg"
          />

          <div className="flex space-x-2 mt-4">
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-2xl font-bold text-indigo-600 mb-4">
            ${product.price}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            Category: {product.category.name}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="my-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
};
