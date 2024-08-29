'use client';

import useFavorites from '@/app/(site)/favorites/useFavorites';
import List from '@/components/Movie/List';
import useMounted from '@/hooks/useMounted';

export default function Container() {
  const { pages } = useFavorites();
  const isMounted = useMounted();

  if (isMounted && !pages[0]?.results?.length)
    return (
      <div className='h-40 w-full flex items-center text-center justify-center text-xl text-muted-foreground'>
        There are no items in your favorites list
      </div>
    );

  return <List pages={pages} />;
}
