'use client';

import List from '@/components/Movie/List';

import useTop from './useTop';

export default function Container() {
  const { data: top, hasNextPage, fetchNextPage, isFetched } = useTop();

  return (
    <>
      <List pages={top?.pages || []} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />
      {isFetched && !top?.pages?.[0]?.results?.length && (
        <div className='h-40 w-full flex items-center justify-center text-xl text-muted-foreground'>
          Nothing was found
        </div>
      )}
    </>
  );
}
