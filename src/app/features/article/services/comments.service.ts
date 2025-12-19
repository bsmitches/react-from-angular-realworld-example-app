import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Comment } from '../models';

interface CommentsResponse {
  comments: Comment[];
}

interface CommentResponse {
  comment: Comment;
}

export function useComments(slug: string) {
  return useQuery({
    queryKey: ['comments', slug],
    queryFn: async (): Promise<Comment[]> => {
      const response = await apiClient.get<CommentsResponse>(`/articles/${slug}/comments`);
      return response.data.comments;
    },
    enabled: !!slug,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, body }: { slug: string; body: string }): Promise<Comment> => {
      const response = await apiClient.post<CommentResponse>(`/articles/${slug}/comments`, {
        comment: { body },
      });
      return response.data.comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.slug] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, commentId }: { slug: string; commentId: number }): Promise<void> => {
      await apiClient.delete(`/articles/${slug}/comments/${commentId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.slug] });
    },
  });
}
