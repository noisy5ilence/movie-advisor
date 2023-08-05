'use client';

import List from '@/components/Movie/List';

import useTop from './useTop';

export default function Container() {
  const { data: top, hasNextPage, fetchNextPage } = useTop();

  return <List pages={top?.pages || []} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />;
}
