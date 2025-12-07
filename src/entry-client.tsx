import './index.css';
import App from './App';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      gcTime: 10000,
    },
  },
});

export const AppWrapper = () => {
  hydrate(queryClient, window.__PRELOADED_QUERY_STATE__);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

hydrateRoot(document.getElementById('root') as HTMLElement, <AppWrapper />);
