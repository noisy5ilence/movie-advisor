'use client';

import { useSearchParams } from 'next/navigation';

import List from '@/components/List';
import NoResults from '@/components/NoResults';

import useSimilar from './useSimilar';

const Container = () => {
  const params = useSearchParams();

  const title = params.get('title') as string;
  const showId = params.get('id') as string;
  const showType = params.get('type') as Show['type'];

  const { shows, fetchNextPage, isFetched } = useSimilar({ showId, showType });

  return (
    <>
      {Boolean(title) && (
        <span className='inline-flex w-full h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-2'>
          Similar: {decodeURIComponent(title)}
        </span>
      )}
      <List shows={shows} fetchNextPage={fetchNextPage} />
      {isFetched && !shows.length && <NoResults />}
    </>
  );
};

export default Container;
