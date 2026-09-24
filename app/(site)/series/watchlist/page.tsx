import { Metadata } from 'next';

import UsersList from '@/app/(site)/(favorites)/components/UsersLists';
import { TITLE } from '@/env';

export const metadata: Metadata = {
  title: `My watchlist | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`,
  robots: { index: false }
};

const WatchList = () => (
  <>
    <h1 className='sr-only'>My Watchlist</h1>
    <UsersList list='watchlist' label='watchlist' type='tv' />
  </>
);

export default WatchList;
