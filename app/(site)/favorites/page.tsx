import { Metadata } from 'next';

import UsersList from '@/components/UsersLists';
import { session } from '@/data';
import { TITLE } from '@/env';

export const metadata: Metadata = {
  title: `My Favorite Shows - ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`
};

const Favorites = async () => <UsersList session={await session()} list='favorite' label='favorites' />;

export default Favorites;
