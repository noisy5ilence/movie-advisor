'use client';

import List from '@/components/List';
import useMounted from '@/hooks/useMounted';

import useFavorites from './useFavorites';

export default function Container() {
  const { shows } = useFavorites();
  const isMounted = useMounted();

  if (!isMounted) return null;

  if (!shows.length)
    return (
      <div className='flex h-40 w-full items-center justify-center text-center text-xl text-muted-foreground'>
        There are no items in your favorites list
      </div>
    );

  return <List shows={shows} />;
}
