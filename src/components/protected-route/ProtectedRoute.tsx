import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/use-auth/useAuth';

type ProtectedRouteProps = { children: ReactNode };

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && isAuthenticated !== null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children as React.JSX.Element;
};
