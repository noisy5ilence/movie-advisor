import { Metadata } from 'next';

import Container from './container';

export const metadata: Metadata = {
  title: 'My Favorite Shows - Movie Advisor',
  description:
    'View your favorite shows on Movie Advisor. Keep track of films you’ve added and revisit your top picks anytime.'
};

const Favorites = () => {
  return <Container />;
};

export default Favorites;
