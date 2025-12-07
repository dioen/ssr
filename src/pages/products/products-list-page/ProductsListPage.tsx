// TODO: try to use server components?

import { Link } from 'react-router-dom';
import { ProductsList } from '../../../components/products/products-list/ProductsList';

const ProductsListPage = () => (
  <div className="flex flex-col">
    {/* React 19 can hoist head tags
            TODO: change to Helmet or check if native react meta hoisting works on SSR */}
    <title>Home Page</title>
    <meta name="description" content="Products App Home Page" />

    <h1 className="mt-10">Products Page</h1>

    <Link
      to="/products/new"
      className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:text-white right-0"
    >
      Add new product
    </Link>

    <ProductsList />
  </div>
);

export default ProductsListPage;
