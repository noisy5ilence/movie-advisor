'use client';

import popularQuery from '@/data/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTop = (type: Show['type']) =>
  useInfiniteList({ ...popularQuery({ sortBy: 'vote_average.desc', type }), mode: 'default', list: 'top' });

export default useTop;
