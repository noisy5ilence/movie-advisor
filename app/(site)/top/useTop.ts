'use client';

import { useAtomValue } from 'jotai';

import { showTypeAtom } from '@/components/ShowTypeToggle';
import popularQuery from '@/data/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTop = () => {
  const showType = useAtomValue(showTypeAtom);

  return useInfiniteList({
    ...popularQuery({ sortBy: 'vote_average.desc', type: showType }),
    mode: 'default',
    list: 'top'
  });
};

export default useTop;
