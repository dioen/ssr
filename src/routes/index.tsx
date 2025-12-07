import React from 'react';
import { RouteObject } from 'react-router-dom';

// Should be used react-imported-component for SSR with code splitting
// and browser hydration or other technique to (for example) preload the chunks
// Otherwiste it will cause FOUC or broken SSR hydration
const LoginPage = React.lazy(() => import('../pages/login-page/LoginPage'));
const ProductsListPage = React.lazy(
  () => import('../pages/products/products-list-page/ProductsListPage')
);
const NewProductPage = React.lazy(
  () => import('../pages/products/new-product-page/NewProductPage')
);
const ProductDetailsPage = React.lazy(
  () => import('../pages/products/product-details-page/ProductDetailsPage')
);
const NotFoundPage = React.lazy(
  () => import('../pages/not-found-page/NotFoundPage')
);

export type AppRoute = RouteObject & {
  protectedRoute?: boolean;
  Component: React.ComponentType;
};

export const routes: AppRoute[] = [
  { path: '/login', Component: LoginPage },
  { path: '/products', Component: ProductsListPage, protectedRoute: true },
  { path: '/products/new', Component: NewProductPage, protectedRoute: true },
  {
    path: '/products/:id',
    Component: ProductDetailsPage,
    protectedRoute: true,
  },
  { path: '*', Component: NotFoundPage, protectedRoute: false },
];
