'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { similarMovies, topMovies } from '@/lib/api';

const useTop = ({ starring, similar }: { starring?: string; similar?: string }) => {
  return useInfiniteQuery({
    queryKey: ['top', starring, similar],
    queryFn: ({ pageParam }) => {
      return similar
        ? similarMovies({ page: pageParam as string, movieId: similar })
        : topMovies({ page: pageParam as string, starring: starring! });
    },
    getNextPageParam(lastPage) {
      const { page, total_pages } = lastPage as { page: number; total_pages: number };
      if (page === total_pages) return undefined;

      return `${page + 1}`;
    },
    initialPageParam: '1'
  });
};

export default useTop;
