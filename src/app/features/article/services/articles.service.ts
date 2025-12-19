import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Article, ArticleListConfig } from '../models';

interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

interface ArticleResponse {
  article: Article;
}

export function useArticles(config: ArticleListConfig) {
  const params = new URLSearchParams();

  Object.entries(config.filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const endpoint = config.type === 'feed' ? '/articles/feed' : '/articles';

  return useQuery({
    queryKey: ['articles', config],
    queryFn: async (): Promise<ArticlesResponse> => {
      const response = await apiClient.get<ArticlesResponse>(endpoint, { params });
      return response.data;
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async (): Promise<Article> => {
      const response = await apiClient.get<ArticleResponse>(`/articles/${slug}`);
      return response.data.article;
    },
    enabled: !!slug,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: Partial<Article>): Promise<Article> => {
      const response = await apiClient.post<ArticleResponse>('/articles', { article });
      return response.data.article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: Partial<Article> & { slug: string }): Promise<Article> => {
      const response = await apiClient.put<ArticleResponse>(`/articles/${article.slug}`, { article });
      return response.data.article;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', data.slug] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string): Promise<void> => {
      await apiClient.delete(`/articles/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useFavoriteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string): Promise<Article> => {
      const response = await apiClient.post<ArticleResponse>(`/articles/${slug}/favorite`, {});
      return response.data.article;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', data.slug] });
    },
  });
}

export function useUnfavoriteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string): Promise<Article> => {
      const response = await apiClient.delete<ArticleResponse>(`/articles/${slug}/favorite`);
      return response.data.article;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', data.slug] });
    },
  });
}
