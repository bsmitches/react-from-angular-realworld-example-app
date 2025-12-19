import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '../auth-store';
import { LoginCredentials, UserResponse } from '../types/user.types';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<UserResponse> => {
      const response = await apiClient.post<UserResponse>('/users/login', {
        user: credentials,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      navigate('/');
    },
  });
}

export default useLogin;
