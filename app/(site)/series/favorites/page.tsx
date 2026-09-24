import { Metadata } from 'next';

import UsersList from '@/app/(site)/(favorites)/components/UsersLists';
import { TITLE } from '@/env';

export const metadata: Metadata = {
  title: `My Favorite Shows | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`,
  robots: { index: false }
};

const Favorites = () => (
  <>
    <h1 className='sr-only'>My Favorite Shows</h1>
    <UsersList list='favorite' label='favorites' type='tv' />
  </>
);

export default Favorites;
