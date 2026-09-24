import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { TITLE } from '@/env';

import UsersList from '../components/UsersLists';

export const metadata: Metadata = {
  title: `My watchlist | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`,
  robots: { index: false }
};

interface SearchParams {
  type?: string;
}

const WatchList = async ({ searchParams }: { searchParams: SearchParams }) => {
  if (searchParams.type === 'tv') redirect('/series/watchlist');

  return (
    <>
      <h1 className='sr-only'>My Watchlist</h1>
      <UsersList list='watchlist' label='watchlist' type='movie' />
    </>
  );
};

export default WatchList;
