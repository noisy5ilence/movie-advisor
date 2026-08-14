import { SITE_URL } from '@/env';

import { showPath } from './utils';

export const itemList = (shows: Show[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: shows.map((show, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}${showPath(show)}`,
    name: show.title
  }))
});
