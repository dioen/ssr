import App from './App';
import { StrictMode } from 'react';
import {
  renderToPipeableStream,
  RenderToPipeableStreamOptions,
} from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function render(
  _url: string,
  queryClient: QueryClient,
  options: RenderToPipeableStreamOptions
) {
  return renderToPipeableStream(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={`/${_url}`}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
      <vite-streaming-end></vite-streaming-end>
    </StrictMode>,
    options
  );
}
