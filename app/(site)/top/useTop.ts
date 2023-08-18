'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import API from './api';

const useTop = ({ starring, similar }: { starring: string | null; similar: string | null }) => {
  return useInfiniteQuery({
    queryKey: ['top', starring, similar],
    queryFn: ({ pageParam: page }) => (similar ? API.similar({ page, movieId: similar }) : API.top({ page, starring })),
    suspense: true,
    getNextPageParam({ page, total_pages }) {
      if (page === total_pages) return undefined;

      return `${page + 1}`;
    },
    defaultPageParam: '1'
  });
};

export default useTop;
