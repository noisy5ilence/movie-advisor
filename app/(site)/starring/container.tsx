'use client';

import { useSearchParams } from 'next/navigation';

import List from '@/components/Movie/List';

import useStarring from './useStarring';

export default function Container() {
  const params = useSearchParams();

  const title = params.get('title');
  const actorId = params.get('actorId') || undefined;

  const { data: top, hasNextPage, fetchNextPage, isFetched } = useStarring({ actorId });

  return (
    <>
      {Boolean(title) && (
        <span className='inline-flex w-full h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-2'>
          Starring: {decodeURIComponent(title || '')}
        </span>
      )}
      <List pages={top?.pages || []} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />
      {isFetched && !top?.pages?.[0]?.results?.length && (
        <div className='h-40 w-full flex items-center justify-center text-xl text-muted-foreground'>
          Nothing was found
        </div>
      )}
    </>
  );
}
