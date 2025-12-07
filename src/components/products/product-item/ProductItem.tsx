import React from 'react';
import { deleteProduct, Product } from '../helpers';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../contexts/use-notification/useNotification';

interface ProductItemProps extends Product {
  onEdit?: (id: number) => void;
  refetchProducts: () => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  id,
  title,
  description,
  price,
  category,
  images,
  onEdit,
  refetchProducts,
}) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleDelete = () => {
    // TODO: add is loading state handling
    deleteProduct(id.toString(), addNotification, refetchProducts);
  };
  const handleDetailsPageNavigate = () => {
    navigate(`/products/${id}`);
  };

  return (
    <div
      key={id}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img src={images[0]} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 truncate">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold text-lg">${price}</span>

          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {category.name}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDetailsPageNavigate}
            className="mt-4 w-full bg-blue-500 text-sm text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Details
          </button>

          <button
            onClick={() => onEdit?.(id)}
            className="mt-4 w-full bg-green-500 text-sm text-white py-2 rounded hover:bg-green-600 transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="mt-4 w-full bg-red-500 text-sm text-white py-2 rounded hover:bg-red-600 transition"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};
