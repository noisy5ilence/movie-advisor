'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { popularMovies } from '@/lib/api';

const usePopular = () => {
  return useInfiniteQuery({
    queryKey: ['popular'],
    queryFn: ({ pageParam }) => {
      return popularMovies({ page: pageParam as string });
    },
    getNextPageParam(lastPage) {
      const { page, total_pages } = lastPage as { page: number; total_pages: number };
      if (page === total_pages) return undefined;

      return `${page + 1}`;
    },
    initialPageParam: '1'
  });
};

export default usePopular;
