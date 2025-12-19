import { useAuthStore } from '../auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const purgeAuth = useAuthStore((state) => state.purgeAuth);

  return {
    user,
    isAuthenticated,
    setAuth,
    purgeAuth,
  };
}

export default useAuth;
