'use client';

import { startTransition, useCallback, useEffect, useRef } from 'react';
import { atom, getDefaultStore, useAtom } from 'jotai';

import randomQuery from '@/data/queries/random';
import useInfiniteList from '@/hooks/useInfiniteList';
import analytics from '@/lib/analytics';

const indexAtom = atom(0);

export const useSilentIndex = () => getDefaultStore().get(indexAtom);

interface Props {
  page: number;
  type: Show['type'];
}

const useRandomMovie = ({ page, type }: Props) => {
  const [index, setIndex] = useAtom(indexAtom);

  useEffect(() => {
    setIndex(0);
  }, [type, setIndex]);

  const { shows, fetchNextPage, isLoading } = useInfiniteList({
    ...randomQuery({ page, type }),
    mode: 'default',
    list: 'random'
  });

  const showsRef = useRef(shows);

  showsRef.current = shows;

  if (shows.length && !shows[index]) {
    setIndex(0);
  }

  return {
    show: shows[index],
    shows,
    isLoading,
    fetchNextPage,
    onIndexChange: useCallback(
      (index: number) => {
        analytics.randomShuffled({ index, showTitle: showsRef.current[index]?.title ?? '' });
        startTransition(() => setIndex(index));
      },
      [setIndex]
    )
  };
};

export default useRandomMovie;
