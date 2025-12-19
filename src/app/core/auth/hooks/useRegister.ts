import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '../auth-store';
import { RegisterCredentials, UserResponse } from '../types/user.types';

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials): Promise<UserResponse> => {
      const response = await apiClient.post<UserResponse>('/users', {
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

export default useRegister;
