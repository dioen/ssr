import { useForm } from 'react-hook-form';
import { validateImages } from './helpers';
import { useNavigate } from 'react-router-dom';
import { createProduct, fetchCategories, FiltersResponse } from '../helpers';
import { useNotification } from '../../../contexts/use-notification/useNotification';
import { useQuery } from '@tanstack/react-query';

export interface NewProductFormData {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string;
}

export const NewProductForm = () => {
  const { data } = useQuery<FiltersResponse[]>({
    queryKey: ['product_categories'],
    queryFn: fetchCategories,
  });

  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewProductFormData>();

  const onFormSubmit = (data: NewProductFormData) => {
    const images = data.images
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img);
    const productData = {
      title: data.title,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId.toString(),
      images,
    };

    // TODO: add is loading state handling
    createProduct(productData, reset, navigate, addNotification);
  };

  const categories = data || [];

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-[90%] md:w-[600px] bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">Create New Product</h2>

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
        <label className="block text-sm font-medium mb-1">Description</label>

        <textarea
          {...register('description', { required: 'Description is required' })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
        />

        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          {...register('categoryId', {
            required: 'Category is required',
            valueAsNumber: true,
          })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
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
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />

        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Create Product
      </button>
    </form>
  );
};
