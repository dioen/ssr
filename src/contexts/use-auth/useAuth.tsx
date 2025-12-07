import React from 'react';
import HttpStatus from 'http-status';
import { useNotification } from '../use-notification/useNotification';

const AuthContext = React.createContext<{
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// TODO: implement logout when response from server is 401 Unauthorized

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { addNotification } = useNotification();

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null
  );

  const login = React.useCallback(
    (username: string, password: string) => {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      })
        .then((response) => {
          if (response.status === HttpStatus.OK) {
            setIsAuthenticated(true);
            addNotification('Login successful', 'success');
          } else {
            addNotification('Invalid credentials', 'error');
          }
        })
        .catch((error) => {
          console.error('Login failed:', error);
          addNotification('Login failed', 'error');
        });
    },
    [addNotification]
  );

  const logout = React.useCallback(() => {
    fetch('/api/auth/logout', {
      method: 'POST',
    })
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          setIsAuthenticated(false);
          addNotification('Logout successful', 'success');
        } else {
          addNotification('Logout failed', 'error');
        }
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        addNotification('Logout failed', 'error');
      });
  }, [addNotification]);

  React.useLayoutEffect(() => {
    if (isAuthenticated === null) {
      setIsAuthenticated(
        (window as any)?.__PRELOADED_AUTH_DATA__?.isAuthenticated
      );
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
};
