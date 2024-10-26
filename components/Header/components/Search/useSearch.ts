import { useRef } from 'react';

import searchQuery, { SearchQueryProps } from '@/api/queries/search';
import useInfiniteList from '@/hooks/useInfiniteList';

const useSearch = (props: SearchQueryProps) => {
  const previousRef = useRef<Show[]>([]);

  const infiniteQuery = useInfiniteList(searchQuery(props));

  if (infiniteQuery.isFetched) {
    previousRef.current = infiniteQuery.shows;
  }

  if (!props.query) {
    previousRef.current = [];
  }

  return {
    ...infiniteQuery,
    shows: infiniteQuery.isLoading ? previousRef.current : infiniteQuery.shows
  };
};

export default useSearch;
