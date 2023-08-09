'use client';

import { useSearchParams } from 'next/navigation';

import usePerson from '@/app/(site)/top/usePerson';
import List from '@/components/Movie/List';

import useTop from './useTop';

export default function Container() {
  const starring = useSearchParams().get('starring');
  const { data: person } = usePerson({ id: starring });
  const { data: top, hasNextPage, fetchNextPage } = useTop({ starring });

  return (
    <>
      {Boolean(person) && (
        <span className='inline-flex w-full h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-2'>
          Starring: {person?.name}
        </span>
      )}
      <List pages={top?.pages || []} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />
    </>
  );
}
