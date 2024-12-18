'use client';

import popularQuery from '@/data/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTop = () => useInfiniteList({ ...popularQuery({ sortBy: 'vote_average.desc' }), mode: 'default' });

export default useTop;
