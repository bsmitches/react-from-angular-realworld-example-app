import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from './core/layout/Header';
import { Footer } from './core/layout/Footer';
import { ProtectedRoute } from './core/auth/components/ProtectedRoute';

const HomePage = lazy(() => import('./features/article/pages/home/HomePage'));
const AuthPage = lazy(() => import('./core/auth/pages/AuthPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));
const EditorPage = lazy(() => import('./features/article/pages/editor/EditorPage'));
const ArticlePage = lazy(() => import('./features/article/pages/article/ArticlePage'));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));

function Layout() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container">Loading...</div>}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <AuthPage />,
      },
      {
        path: '/register',
        element: <AuthPage />,
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/editor',
        element: (
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/editor/:slug',
        element: (
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/article/:slug',
        element: <ArticlePage />,
      },
      {
        path: '/profile/:username',
        element: <ProfilePage />,
      },
      {
        path: '/profile/:username/favorites',
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;
