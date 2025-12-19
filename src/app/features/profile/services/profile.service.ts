import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Profile } from '../models';

interface ProfileResponse {
  profile: Profile;
}

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: async (): Promise<Profile> => {
      const response = await apiClient.get<ProfileResponse>(`/profiles/${username}`);
      return response.data.profile;
    },
    enabled: !!username,
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string): Promise<Profile> => {
      const response = await apiClient.post<ProfileResponse>(`/profiles/${username}/follow`, {});
      return response.data.profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string): Promise<Profile> => {
      const response = await apiClient.delete<ProfileResponse>(`/profiles/${username}/follow`);
      return response.data.profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
