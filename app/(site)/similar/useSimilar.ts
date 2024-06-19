'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { similarMovies } from '@/lib/api';

const useSimilar = ({ movieId, type = 'movie' }: { movieId?: string; type?: ShowType }) => {
  return useInfiniteQuery({
    queryKey: ['similar', movieId, type],
    enabled: Boolean(movieId),
    queryFn: ({ pageParam }) => {
      return similarMovies({ page: pageParam as string, movieId, type });
    },
    getNextPageParam(lastPage) {
      const { page, total_pages } = lastPage as { page: number; total_pages: number };
      if (page === total_pages) return undefined;

      return `${page + 1}`;
    },
    initialPageParam: '1'
  });
};

export default useSimilar;
