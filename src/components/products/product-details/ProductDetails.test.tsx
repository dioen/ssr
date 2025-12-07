import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductDetails } from './ProductDetails';
import { Product } from '../helpers';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// Mock placeholder
vi.mock('./product-details-placeholder/ProductDetailsPlaceholder.js', () => ({
  ProductDetailsPlaceholder: () => <div>Placeholder</div>,
}));

describe('ProductDetails', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test description',
    price: 100,
    images: ['image1.jpg', 'image2.jpg'],
    category: {
      id: 1,
      slug: 'test-category',
      name: 'Test Category',
      image: 'cat.jpg',
      creationAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    creationAt: '2023-01-01',
    updatedAt: '2023-01-01',
    slug: 'test-product',
  };

  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  it('should render placeholder when fetching', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isFetching: true,
      isLoading: true,
      isError: false,
      error: null,
      isPending: true,
      isSuccess: false,
      isPlaceholderData: false,
      refetch: vi.fn(),
    } as any);

    render(<ProductDetails />);

    expect(screen.getByText('Placeholder')).toBeInTheDocument();
  });

  it('should render "Product not found" when no product', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isFetching: false,
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isPlaceholderData: false,
      refetch: vi.fn(),
    } as any);

    render(<ProductDetails />);

    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('should render product details', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockProduct,
      isFetching: false,
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isPlaceholderData: false,
      refetch: vi.fn(),
    } as any);

    render(<ProductDetails />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Category: Test Category')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    expect(screen.getAllByAltText(/Test Product/)).toHaveLength(2); // Main + gallery
  });

  it('should call navigate(-1) on Back button click', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useQuery).mockReturnValue({
      data: mockProduct,
      isFetching: false,
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isPlaceholderData: false,
      refetch: vi.fn(),
    } as any);

    render(<ProductDetails />);

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should display gallery images', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockProduct,
      isFetching: false,
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isPlaceholderData: false,
      refetch: vi.fn(),
    } as any);

    render(<ProductDetails />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // Main + 1 gallery
    expect(images[1]).toHaveAttribute('alt', 'Test Product 1');
  });
});
