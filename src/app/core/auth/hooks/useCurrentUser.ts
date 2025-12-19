import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '../auth-store';
import { UserResponse } from '../types/user.types';

export function useCurrentUser() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const purgeAuth = useAuthStore((state) => state.purgeAuth);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<UserResponse> => {
      const response = await apiClient.get<UserResponse>('/user');
      return response.data;
    },
    enabled: !!window.localStorage.getItem('jwtToken'),
    select: (data) => {
      setAuth(data.user);
      return data;
    },
    retry: false,
    meta: {
      onError: () => {
        purgeAuth();
      },
    },
  });
}

export default useCurrentUser;
