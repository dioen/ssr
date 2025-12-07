import fs from 'node:fs/promises';
import dotenv from 'dotenv';
import express from 'express';
import HttpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchProducts } from './src/components/products/helpers.ts';
import { Transform } from 'node:stream';
dotenv.config();

// CORS should be configured properly in production

const TOKEN_COOKIE_NAME = 'token';
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';

// Create http server
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// All middlewares should be placed in src/serever/middlewares
// as TypeScript files and be boundled by Vite for production use.

// Here is an example authentication middleware
// with redirect to /login if not authenticated
app.use((req, res, next) => {
  // Routes should be taken from routes definition or config
  // /login route and other app routes should be get from src/routes
  // They are not imported here because of lack of TS bundling in this example
  const publicRoutes = [
    '/login',
    '/favicon.ico',
    '/assets',
    '/api',
    '/_vite',
    '/@fs',
  ];

  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  try {
    if (token) {
      req.user = { isAuthenticated: true };
    } else {
      req.user = { isAuthenticated: false };
    }

    // Has to be here to make public routes redirect when authenticated work
    if (publicRoutes.some((route) => req.path.startsWith(route))) {
      return next();
    }

    if (!req.user || req.user.isAuthenticated === false) {
      return res.redirect(
        302,
        `/login?next=${encodeURIComponent(req.originalUrl)}`
      );
    }

    return next();
  } catch (err) {
    return res.redirect(
      302,
      `/login?next=${encodeURIComponent(req.originalUrl)}`
    );
  }
});

// Login Proxy
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'email and password required' });
    }

    const authResponse = await fetch(
      `${process.env.VITE_API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!authResponse.ok) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    const authData = await authResponse.json();

    // Secure HTTP(S)-only cookie
    res.cookie(TOKEN_COOKIE_NAME, authData.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/',
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Clear token and set request auth to unauthenticated
app.post('/api/auth/logout', (req, res) => {
  try {
    res.clearCookie(TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });

    // Set cookie to an empty token to ensure logout
    res.cookie(TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    res.user = { isAuthenticated: false };

    return res.json({ ok: true });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Product Proxy
app.put('/products/:id', async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing product id' });
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
  }

  try {
    const response = await fetch(
      `${process.env.VITE_API_BASE_URL}/products/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const updatedProduct = await response.json();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Product Proxy
app.delete('/delete', async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing product id' });
  }

  try {
    const response = await fetch(
      `${process.env.VITE_API_BASE_URL}/products/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New Product Proxy
app.post('/products/new', async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const { title, price, description, categoryId, images } = req.body;

  if (!title || !price || !description || !categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch(`${process.env.VITE_API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        price: Number(price),
        description,
        categoryId: Number(categoryId),
        images: Array.isArray(images) ? images : [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message });
    }

    const newProduct = await response.json();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    // Create Query Client per request
    // to avoid sharing state between different users
    const queryClient = new QueryClient();

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    template = template.replace(
      '<!--app-preloaded-auth-data-->',
      JSON.stringify({
        isAuthenticated: !!req.user?.isAuthenticated,
      })
    );

    // Prefetch data
    // Render app once to register all queries
    // or prefetch each required query manually here
    const prefetchManually = true;

    if (prefetchManually) {
      const query = new URLSearchParams(req.url.split('?')[1] || '');

      await queryClient.prefetchQuery({
        queryKey: ['products', query.toString()],
        queryFn: () => fetchProducts(query),
      });
    } else {
      // Not working at first render
      // Should be rendered with,  for example, renderToString?
      render(url, queryClient);

      const queryPromises = await queryClient.getQueryCache().findAll();

      await Promise.all(queryPromises.map((query) => query.fetch()));
    }

    let didError = false;

    const { pipe, abort } = render(url, queryClient, {
      onShellError() {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.set({ 'Content-Type': 'text/html' });
        res.send('<h1>Something went wrong</h1>');
      },
      onAllReady() {
        res.status(didError ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK);
        res.set({ 'Content-Type': 'text/html' });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);
        let htmlEnded = false;

        const transformStream = new Transform({
          async transform(chunk, encoding, callback) {
            // See entry-server.tsx for more details of this code
            if (!htmlEnded) {
              chunk = chunk.toString();

              if (chunk.includes('<vite-streaming-end></vite-streaming-end>')) {
                htmlEnded = true;

                res.write(
                  chunk.replace(
                    '<vite-streaming-end></vite-streaming-end>',
                    htmlEnd.replace(
                      '<!--preloaded-query-state-->',
                      `<script>window.__PRELOADED_QUERY_STATE__ = ${JSON.stringify(
                        dehydrate(queryClient)
                      )}</script>`
                    )
                  ),
                  'utf-8'
                );
              } else {
                res.write(chunk, 'utf-8');
              }
            } else {
              res.write(chunk, encoding);
            }

            callback();
          },
        });

        transformStream.on('finish', (asd) => {
          res.end();
        });

        res.write(htmlStart);

        pipe(transformStream);
      },
      onError(error) {
        didError = true;
        // Log to service like Sentry
      },
    });

    setTimeout(() => {
      abort();
    }, 10000);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
