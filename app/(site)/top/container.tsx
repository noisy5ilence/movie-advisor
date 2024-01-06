'use client';

import { useSearchParams } from 'next/navigation';

import List from '@/components/Movie/List';

import useTop from './useTop';

export default function Container() {
  const params = useSearchParams();

  const starring = params.get('starring')!;
  const similar = params.get('similar')!;
  const title = params.get('title');

  const { data: top, hasNextPage, fetchNextPage, isFetched } = useTop({ starring, similar });

  return (
    <>
      {Boolean(title && (starring || similar)) && (
        <span className='inline-flex w-full h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-2'>
          {starring ? 'Starring' : 'Similar'}: {decodeURIComponent(title || '')}
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
