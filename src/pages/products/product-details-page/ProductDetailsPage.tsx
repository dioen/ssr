import { ProductDetails } from '../../../components/products/product-details/ProductDetails';

// TODO: try to use server components?

const ProductDetailsPage = () => {
  return (
    <div className="h-full min-h-full flex items-center justify-center">
      {/* React 19 can hoist head tags 
            TODO: change to Helmet or check if native react meta hoisting works on SSR */}
      <title>Product Details Page</title>
      <meta name="description" content="View product details" />

      <ProductDetails />
    </div>
  );
};

export default ProductDetailsPage;
