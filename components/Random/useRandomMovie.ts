'use client';

import { startTransition, useCallback } from 'react';
import { atom, getDefaultStore, useAtom } from 'jotai';

import randomQuery from '@/data/queries/random';
import useInfiniteList from '@/hooks/useInfiniteList';
import useMounted from '@/hooks/useMounted';

const indexAtom = atom(0);

export const useSilentIndex = () => getDefaultStore().get(indexAtom);

interface Props {
  page: number;
}

const useRandomMovie = ({ page }: Props) => {
  const isMounted = useMounted();
  const [index, setIndex] = useAtom(indexAtom);

  const { shows: movies, fetchNextPage } = useInfiniteList(randomQuery({ page, suspense: false }));

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
