'use client';

import popularQuery from '@/data/queries/popular';
import useInfiniteList from '@/hooks/useInfiniteList';

const usePopular = (type: Show['type']) =>
  useInfiniteList({ ...popularQuery({ type }), mode: 'default', list: 'popular' });

export default usePopular;
