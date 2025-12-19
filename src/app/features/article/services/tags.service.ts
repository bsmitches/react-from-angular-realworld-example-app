import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface TagsResponse {
  tags: string[];
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<string[]> => {
      const response = await apiClient.get<TagsResponse>('/tags');
      return response.data.tags;
    },
  });
}
