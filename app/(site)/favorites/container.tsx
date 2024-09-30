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
      <div className='h-40 w-full flex items-center text-center justify-center text-xl text-muted-foreground'>
        There are no items in your favorites list
      </div>
    );

  return <List shows={shows} />;
}
