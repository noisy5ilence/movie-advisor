import { Metadata } from 'next';

import { TITLE } from '@/env';

import UsersList from '../components/UsersLists';

export const metadata: Metadata = {
  title: `My Favorite Shows | ${TITLE}`,
  description: `View your favorite shows on ${TITLE}. Keep track of films you’ve added and revisit your top picks anytime.`,
  robots: { index: false }
};

const Favorites = () => {
  return <UsersList list='favorite' label='favorites' />;
};

export default Favorites;
