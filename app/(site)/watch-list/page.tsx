import { Metadata } from 'next';

import UsersList from '@/components/UsersLists';
import { session } from '@/data';
import { TITLE } from '@/env';

export const metadata: Metadata = {
  title: `My watch list - ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`
};

const WatchList = async () => <UsersList session={await session()} list='watchlist' label='watch' />;

export default WatchList;
