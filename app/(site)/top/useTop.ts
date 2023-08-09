'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import API from './api';

const useTop = ({ starring }: { starring: string | null }) => {
  const page = useSearchParams().get('page');

  return useInfiniteQuery({
    queryKey: ['top', starring],
    queryFn: ({ pageParam: page }) => API.top({ page, starring }),
    suspense: true,
    getNextPageParam({ page, total_pages }) {
      if (page === total_pages) return undefined;

      if (typeof window !== 'undefined') {
        const url = new URL(location.href);

        url.searchParams.set('page', page.toString());

        window.history.pushState(null, '', url.href);
      }

      return `${page + 1}`;
    },
    defaultPageParam: page || '1'
  });
};

export default useTop;
