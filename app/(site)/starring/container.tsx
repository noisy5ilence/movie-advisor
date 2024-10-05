'use client';

import { useSearchParams } from 'next/navigation';

import List from '@/components/List';
import NoResults from '@/components/NoResults';

import useStarring from './useStarring';

const Container = () => {
  const params = useSearchParams();

  const title = params.get('title') as string;
  const actorId = params.get('actorId') as string;

  const { shows, fetchNextPage, isFetched } = useStarring({ actorId });

  return (
    <>
      {Boolean(title) && (
        <span className='mb-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'>
          Starring: {decodeURIComponent(title || '')}
        </span>
      )}
      <List shows={shows} fetchNextPage={fetchNextPage} />
      {isFetched && !shows.length && <NoResults />}
    </>
  );
};

export default Container;
