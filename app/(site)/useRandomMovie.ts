'use client';

import { startTransition, useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import useSessionRef from '@/hooks/useSessionRef';
import { randomMovies } from '@/lib/api';

const useRandomMovie = () => {
  const [indexRef, setIndexRef] = useSessionRef('random-movie-index', 0);
  const [index, setIndex] = useState(indexRef.current);

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['random-movie'],
    queryFn: () => randomMovies(),
    getNextPageParam: () => '',
    initialPageParam: ''
  });

  const movies = useMemo(
    () =>
      data?.pages.reduce((movies, page) => {
        movies.push(...page);
        return movies;
      }, []),
    [data]
  );

  return {
    index,
    movies,
    movie: movies?.[index],
    fetchNextPage,
    onIndexChange: useCallback(
      (index: number) => {
        setIndexRef(index);
        startTransition(() => setIndex(index));
      },
      [setIndexRef]
    )
  };
};

export default useRandomMovie;
