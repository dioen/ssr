import React from 'react';
import { useForm } from 'react-hook-form';
import { validateImages } from '../new-product-form/helpers';
import { ProductEdit } from '../helpers';

interface ProductEditModalProps {
  product: ProductEdit;
  onClose: () => void;
  onSave: (updatedProduct: Partial<ProductEdit>) => void;
}

interface ProductEditFormData {
  title: string;
  price: number;
  description: string;
  images: string;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductEditFormData>({
    defaultValues: {
      title: product.title,
      price: product.price,
      description: product.description,
      images: product.images.join(', '),
    },
  });

  const onFormSubmit = (data: ProductEditFormData) => {
    const images = data.images
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img);
    const updatedProduct: Partial<ProductEdit> = {
      title: data.title,
      price: data.price,
      description: data.description,
      images,
    };

    onSave(updatedProduct);
  };

  return (
    <div className="bg-black bg-opacity-50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-0 text-md text-gray-600 hover:text-gray-800"
        >
          &#10005;
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>

            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>

            <input
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Price must be greater than 0' },
              })}
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              {...register('description', {
                required: 'Description is required',
              })}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />

            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Images (comma-separated URLs)
            </label>

            <textarea
              {...register('images', { validate: validateImages })}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={2}
            />

            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
