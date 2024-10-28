'use client';

import popularQuery from '@/data/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const usePopular = () => useInfiniteList(popularQuery());

export default usePopular;
