import React from 'react';
import './index.css';
import './App.css';
import { MainLayout } from './layouts/main-layout/MainLayout';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { ProtectedRoute } from './components/protected-route/ProtectedRoute';
import { AuthContextProvider } from './contexts/use-auth/useAuth';
import { NotificationProvider } from './contexts/use-notification/useNotification';
import { Notifications } from './components/notifications/Notifications';

const Main = React.memo(() => (
  <>
    <main>
      <MainLayout>
        <Routes>
          {routes.map(({ path, protectedRoute, Component }) =>
            protectedRoute ? (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <Component />
                  </ProtectedRoute>
                }
              />
            ) : (
              <Route key={path} path={path} element={<Component />} />
            )
          )}
        </Routes>
      </MainLayout>
    </main>
    <Notifications />
  </>
));

const App = () => {
  return (
    <NotificationProvider>
      <AuthContextProvider>
        <Main />
      </AuthContextProvider>
    </NotificationProvider>
  );
};

export default App;
