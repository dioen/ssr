import { useAuth } from '../../contexts/use-auth/useAuth';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow">
              P
            </div>

            <div className="leading-tight">
              <h1 className="text-lg font-semibold tracking-tight">
                Products App
              </h1>
              <p className="text-xs text-gray-500">Minimal. Fast. Modern.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={logout}
                aria-label="Logout"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-grow flex">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col pb-8">
          {children}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
          &copy; 2025 Products App
        </div>
      </footer>
    </div>
  );
};
