import React from 'react';
import { PRODUCTS_PER_PAGE_DEFAULT } from '../../../consts.js';

export const ProductsPlaceholder: React.FC = () => (
  <>
    {Array.from({ length: PRODUCTS_PER_PAGE_DEFAULT }, (_, index) => (
      <div
        key={index}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
      >
        <div className="w-full h-48 bg-gray-300"></div>

        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </>
);
