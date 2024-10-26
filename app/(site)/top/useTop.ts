'use client';

import popularQuery from '@/api/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const useTop = () => useInfiniteList(popularQuery({ sortBy: 'vote_average.desc' }));

export default useTop;
