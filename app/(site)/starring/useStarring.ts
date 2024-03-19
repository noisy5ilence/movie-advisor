'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { topMovies } from '@/lib/api';

const useStarring = ({ actorId }: { actorId?: string }) => {
  return useInfiniteQuery({
    queryKey: ['starring', actorId],
    enabled: Boolean(actorId),
    queryFn: ({ pageParam }) => {
      return topMovies({ page: pageParam as string, starring: actorId });
    },
    getNextPageParam(lastPage) {
      const { page, total_pages } = lastPage as { page: number; total_pages: number };
      if (page === total_pages) return undefined;

      return `${page + 1}`;
    },
    initialPageParam: '1'
  });
};

export default useStarring;
