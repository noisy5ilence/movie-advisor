'use client';

import { useAtomValue } from 'jotai';

import { showTypeAtom } from '@/components/ShowTypeToggle';
import popularQuery from '@/data/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const usePopular = () => {
  const showType = useAtomValue(showTypeAtom);

  return useInfiniteList({ ...popularQuery({ type: showType }), mode: 'default', list: 'popular' });
};

export default usePopular;
