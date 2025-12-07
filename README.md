# Template SSR React TypeScript

A modern, full-stack template for building server-side rendered (SSR) React applications with TypeScript. This project serves as a starting point for recruitment tasks, featuring SSR with Vite, Express server, data fetching with TanStack Query, and more.

## Development and Improvement Notes

This section outlines current limitations, planned improvements, and development notes for the project.

### Known Issues and Limitations

1. **Missing Husky and Pre-commit Hooks**: No pre-commit hooks are set up for linting and formatting. Consider adding Husky for automated code quality checks.
2. **Streaming Implementation**: Streaming has been added but does not yet support onShellReady.
3. **Server.js Refactor Needed**: The server.js file requires refactoring for better maintainability and structure.
4. **Full TypeScript Adoption**: The project is not fully set up for TypeScript, including the server side. Consider migrating to full TS support.
5. **React Compiler Integration**: React Compiler is now stable and should be added for potential performance optimizations.
6. **Sorting Limitations**: Sorting is not implemented because it would only sort the fetched portion of products. If added on the frontend, sorting state can be saved in Local Storage.
7. **TODO Items**: Various `// TODO:` comments in the codebase indicate areas for improvement, such as adding loading states, optimizing hooks, and enhancing security.
8. **Product Editing Implementation**: Product editing is implemented as a modal instead of a separate route. If implemented as a separate route, it would require fetching the specific product in the edit page view. In this case, the product is already fetched since it's displayed from the list.

## Features

- **Server-Side Rendering (SSR)**: Improved SEO and initial load performance with React hydration.
- **TypeScript**: Full type safety for better development experience.
- **React 19**: Latest React with concurrent features.
- **Vite**: Fast development server and optimized builds.
- **Express Server**: Custom backend with API proxying, authentication, and product CRUD operations.
- **TanStack React Query**: Efficient data fetching, caching, and synchronization.
- **React Router**: Client-side routing compatible with SSR.
- **React Hook Form**: Form handling with validation.
- **Tailwind CSS**: Utility-first styling.
- **Product Management**: Full CRUD for products (list, create, edit, delete) with external API integration.
- **Notifications**: Context-based toast notifications for user feedback.
- **Testing**: Unit tests with Vitest and UI testing.
- **Linting & Formatting**: ESLint and Prettier for code quality.

## Requirements

- Node.js 22+
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd template-ssr-react-ts
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a [`.env`](.env) file in the root:
   ```env
   VITE_API_BASE_URL=https://api.escuelajs.co/api/v1
   ```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Runs the Express server with SSR support.

### Building

Build for production:

```bash
npm run build
```

Builds client and server bundles separately.

### Preview

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests in watch mode:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests once:

```bash
npm run test:run
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting and Formatting

Lint the code:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

Format the code:

```bash
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── products/
│   │   ├── helpers.ts              # Types, utilities, and API functions
│   │   ├── product-item/           # Product card component
│   │   ├── products-list/          # Main products list with filtering
│   │   ├── products-filter/        # Filter form
│   │   ├── product-details/        # Product details page
│   │   ├── product-edit-modal/     # Edit product modal
│   │   ├── new-product-form/       # Create product form
│   │   └── products-placeholder/   # Loading skeleton
│   └── notifications/              # Notification system
├── contexts/
│   └── use-notification/           # Notification context
├── pages/
│   └── not-found/                  # 404 page
├── App.tsx                         # Main app component
├── main.tsx                        # Client entry
├── entry-server.tsx                # Server entry for SSR
└── index.css                       # Global styles
server.js                           # Express server with routes
vite.config.ts                      # Vite config
eslint.config.ts                    # ESLint config
```

## API

The server proxies to an external API (https://api.escuelajs.co/api/v1). Key routes:

- `GET /products` - Fetch products with pagination/filtering (auth required)
- `POST /products/new` - Create product (auth required)
- `PUT /products/:id` - Update product (auth required)
- `DELETE /delete` - Delete product (auth required)

## Example

Fetch products with TanStack Query:

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});
```

Create a product:

```tsx
await createProduct(productData, reset, navigate, addNotification);
```

## Contributing

1. Fork and clone.
2. Create a branch.
3. Make changes, test, and format.
4. Submit a PR.
