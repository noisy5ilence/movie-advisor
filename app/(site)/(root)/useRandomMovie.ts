'use client';

import { startTransition, useCallback, useRef } from 'react';
import { atom, getDefaultStore, useAtom } from 'jotai';

import randomQuery from '@/data/queries/random';
import useInfiniteList from '@/hooks/useInfiniteList';
import analytics from '@/lib/analytics';

const indexAtom = atom(0);

export const useSilentIndex = () => getDefaultStore().get(indexAtom);

interface Props {
  page: number;
}

const useRandomMovie = ({ page }: Props) => {
  const [index, setIndex] = useAtom(indexAtom);

  const { shows: movies, fetchNextPage } = useInfiniteList({
    ...randomQuery({ page }),
    mode: 'default',
    list: 'random'
  });

  const moviesRef = useRef(movies);

  moviesRef.current = movies;

  if (movies.length && !movies[index]) {
    setIndex(0);
  }

  return {
    movie: movies[index],
    movies,
    fetchNextPage,
    onIndexChange: useCallback(
      (index: number) => {
        analytics.randomShuffled({ index, showTitle: moviesRef.current[index]?.title ?? '' });
        startTransition(() => setIndex(index));
      },
      [setIndex]
    )
  };
};

export default useRandomMovie;
