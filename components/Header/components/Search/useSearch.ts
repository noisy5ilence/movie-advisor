import { useRef } from 'react';

import { search } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useSearch = ({ query, type }: { query: string; type: Show['type'] }) => {
  const previousRef = useRef<Show[]>([]);

  const infiniteQuery = useInfiniteList({
    queryKey: ['search', query, type],
    queryFn: ({ page }) => search({ query, page, type }),
    enabled: Boolean(query)
  });

  if (infiniteQuery.isFetched) {
    previousRef.current = infiniteQuery.shows;
  }

  if (!query) {
    previousRef.current = [];
  }

  return {
    ...infiniteQuery,
    shows: infiniteQuery.isLoading ? previousRef.current : infiniteQuery.shows
  };
};

export default useSearch;
