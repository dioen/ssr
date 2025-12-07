import { useNavigate } from 'react-router-dom';
import { NewProductForm } from '../../../components/products/new-product-form/NewProductForm';

// TODO: try to use server components?

const NewProductPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-full flex items-center justify-center">
      {/* React 19 can hoist head tags 
            TODO: change to Helmet or check if native react meta hoisting works on SSR */}
      <title>New Product Page</title>
      <meta name="description" content="Create a new product" />

      <div>
        <NewProductForm />

        <button
          onClick={() => navigate(-1)}
          className="my-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default NewProductPage;
