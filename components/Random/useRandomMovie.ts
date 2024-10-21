'use client';

import { startTransition, useCallback } from 'react';
import { atom, getDefaultStore, useAtom } from 'jotai';

import { randomMovies } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const indexAtom = atom(0);

export const useSilentIndex = () => getDefaultStore().get(indexAtom);

const useRandomMovie = () => {
  const [index, setIndex] = useAtom(indexAtom);

  const { shows: movies, fetchNextPage } = useInfiniteList({
    suspense: true,
    queryKey: ['random-movie'],
    queryFn: randomMovies
  });

  if (movies.length && !movies[index]) {
    setIndex(0);
  }

  return {
    movie: movies[index],
    movies,
    fetchNextPage,
    onIndexChange: useCallback(
      (index: number) => {
        startTransition(() => setIndex(index));
      },
      [setIndex]
    )
  };
};

export default useRandomMovie;
