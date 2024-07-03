import { showPostsRequest } from '@/api/Posts/posts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export const usePostsList = () => {
  const queryClient = useQueryClient();
  const [params] = useSearchParams();

  let page = params.get('page');
  let currentPage = Number(page) - 1;

  const { data: { content: posts, totalPages, totalElements } = {}, isLoading } = useQuery({
    queryFn: () => showPostsRequest(currentPage),
    queryKey: ['postsList', currentPage],
  });

  if (currentPage < totalPages! - 1) {
    queryClient.prefetchQuery({
      queryKey: ['postsList', currentPage + 1],
      queryFn: () => showPostsRequest(currentPage),
    });
  }

  if (currentPage > 0) {
    queryClient.prefetchQuery({
      queryKey: ['postsList', currentPage - 1],
      queryFn: () => showPostsRequest(currentPage - 1),
    });
  }

  return { posts, isLoading, totalPages, totalElements };
};