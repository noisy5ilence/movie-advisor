import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { TITLE } from '@/env';

import UsersList from '../components/UsersLists';

export const metadata: Metadata = {
  title: `My Favorite Shows | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`,
  robots: { index: false }
};

interface SearchParams {
  type?: string;
}

const Favorites = async ({ searchParams }: { searchParams: SearchParams }) => {
  if (searchParams.type === 'tv') redirect('/series/favorites');

  return (
    <>
      <h1 className='sr-only'>My Favorite Shows</h1>
      <UsersList list='favorite' label='favorites' type='movie' />
    </>
  );
};

export default Favorites;
