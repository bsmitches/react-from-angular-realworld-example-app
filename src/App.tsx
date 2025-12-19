import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { router } from './app/routes';
import { useCurrentUser } from './app/core/auth/hooks/useCurrentUser';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { refetch } = useCurrentUser();

  useEffect(() => {
    const token = window.localStorage.getItem('jwtToken');
    if (token) {
      refetch();
    }
  }, [refetch]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </QueryClientProvider>
  );
}

export default App;
