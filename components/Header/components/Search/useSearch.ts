import { useRef } from 'react';

import { search } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useSearch = ({ query, type }: { query: string; type: Show['type'] }) => {
  const previous = useRef<Show[]>([]);

  const infiniteQuery = useInfiniteList({
    queryKey: ['search', query, type],
    queryFn: ({ page }) => search({ query, page, type }),
    enabled: Boolean(query)
  });

  if (infiniteQuery.isFetched) {
    previous.current = infiniteQuery.shows;
  }

  if (!query) {
    previous.current = [];
  }

  return {
    ...infiniteQuery,
    shows: infiniteQuery.isLoading ? previous.current : infiniteQuery.shows
  };
};

export default useSearch;
