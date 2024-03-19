'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { similarMovies } from '@/lib/api';

const useSimilar = ({ movieId }: { movieId?: string }) => {
  return useInfiniteQuery({
    queryKey: ['similar', movieId],
    enabled: Boolean(movieId),
    queryFn: ({ pageParam }) => {
      return similarMovies({ page: pageParam as string, movieId });
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
