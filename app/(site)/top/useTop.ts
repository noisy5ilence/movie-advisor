'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { topMovies } from '@/lib/api';

const useTop = () => {
  return useInfiniteQuery({
    queryKey: ['top'],
    queryFn: ({ pageParam }) => {
      return topMovies({ page: pageParam as string });
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
