import { Metadata } from 'next';

import { TITLE } from '@/env';

import Container from './container';

export const metadata: Metadata = {
  title: `Top Rated Movies | ${TITLE}`,
  description: `Discover the top-rated movies on ${TITLE}. Find the highest-rated films and make informed viewing choices.`
};

const Top = () => <Container />;

export default Top;
