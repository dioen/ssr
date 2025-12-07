import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { Pagination, countTotalPages } from './Pagination';

// Change of default PRODUCTS_PER_PAGE_DEFAULT for testing purposes
vi.mock('../../../consts', () => ({
  PRODUCTS_PER_PAGE_DEFAULT: 10,
}));

// Mock useSearchParams
const mockSetSearchParams = vi.fn();

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

describe('Pagination', () => {
  beforeEach(() => {
    mockSetSearchParams.mockClear();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);
  });

  describe('countTotalPages', () => {
    it('should calculate total pages correctly', () => {
      expect(countTotalPages(10, 10)).toBe(1);
      expect(countTotalPages(25, 10)).toBe(3);
      expect(countTotalPages(31, 10)).toBe(4);
      expect(countTotalPages(0, 10)).toBe(0);
    });
  });

  describe('Pagination component', () => {
    it('should render with 1 page when itemsCount <= PRODUCTS_PER_PAGE_DEFAULT', () => {
      render(<Pagination itemsCount={10} />);

      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('should render with multiple pages', () => {
      render(<Pagination itemsCount={25} />);

      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('should enable Previous button when not on first page', () => {
      vi.mocked(useSearchParams).mockReturnValue([
        new URLSearchParams('page=2'),
        mockSetSearchParams,
      ]);

      render(<Pagination itemsCount={25} />);

      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /previous/i })
      ).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('should disable Next button on last page', () => {
      vi.mocked(useSearchParams).mockReturnValue([
        new URLSearchParams('page=3'),
        mockSetSearchParams,
      ]);

      render(<Pagination itemsCount={25} />);

      expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /previous/i })
      ).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('should call setSearchParams with correct params on Next click', () => {
      render(<Pagination itemsCount={25} />);

      fireEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(mockSetSearchParams).toHaveBeenCalledWith({
        page: '2',
      });
    });

    it('should call setSearchParams with correct params on Previous click', () => {
      vi.mocked(useSearchParams).mockReturnValue([
        new URLSearchParams('page=2'),
        mockSetSearchParams,
      ]);

      render(<Pagination itemsCount={25} />);

      fireEvent.click(screen.getByRole('button', { name: /previous/i }));

      expect(mockSetSearchParams).toHaveBeenCalledWith({
        page: '1',
      });
    });

    it('should update current page from search params', () => {
      const { rerender } = render(<Pagination itemsCount={25} />);

      vi.mocked(useSearchParams).mockReturnValue([
        new URLSearchParams('page=3'),
        mockSetSearchParams,
      ]);

      rerender(<Pagination itemsCount={25} />);

      expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    });
  });
});
