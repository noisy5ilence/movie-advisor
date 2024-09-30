'use client';

import { startTransition, useCallback, useState } from 'react';

import { randomMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';
import useSessionRef from '@/hooks/useSessionRef';

const useRandomMovie = () => {
  const [indexRef, setIndexRef] = useSessionRef('random-movie-index', 0);
  const [index, setIndex] = useState(indexRef.current);

  const { shows: movies, fetchNextPage } = useInfiniteList({
    queryKey: ['random-movie'],
    queryFn: () => randomMovies()
  });

  if (movies.length && !movies[index]) {
    setIndex(0);
    setIndexRef(0);
  }

  return {
    index,
    movies,
    movie: movies[index],
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
