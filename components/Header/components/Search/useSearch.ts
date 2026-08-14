import { useRef } from 'react';

import searchQuery, { SearchQueryProps } from '@/data/queries/search';
import useInfiniteList from '@/hooks/useInfiniteList';
import useTrackOnce from '@/lib/analytics/useTrackOnce';

const useSearch = (props: SearchQueryProps) => {
  const previousRef = useRef<Show[]>([]);

  const infiniteQuery = useInfiniteList({ ...searchQuery(props), mode: 'default', list: 'search' });

  useTrackOnce(
    'search_performed',
    props.query && infiniteQuery.isFetched ? `${props.type}:${props.query}` : undefined,
    () => ({ query: props.query, showType: props.type, results: infiniteQuery.shows.length })
  );

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
