'use client';

import popularQuery from '@/api/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const usePopular = () => useInfiniteList(popularQuery());

export default usePopular;
