import React from 'react';

export const ProductDetailsPlaceholder: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="mb-4 h-10 bg-gray-300 rounded w-20"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-96 bg-gray-300 rounded-lg"></div>

          <div className="flex space-x-2 mt-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="w-20 h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>

          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>

          <div className="h-8 bg-gray-300 rounded mb-4 w-32"></div>

          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
    </div>
  );
};
