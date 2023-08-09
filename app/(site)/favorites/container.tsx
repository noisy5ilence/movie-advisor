'use client';

import useFavorites from '@/app/(site)/favorites/useFavorites';
import List from '@/components/Movie/List';

export default function Container() {
  const { pages } = useFavorites();

  return <List pages={pages} />;
}
