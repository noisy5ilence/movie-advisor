import { Metadata } from 'next';

import { TITLE } from '@/env';

import UsersList from '../components/UsersLists';

export const metadata: Metadata = {
  title: `My watchlist | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`
};

const WatchList = async () => {
  return <UsersList list='watchlist' label='watchlist' />;
};

export default WatchList;
