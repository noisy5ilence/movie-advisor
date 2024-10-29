import { Metadata } from 'next';

import { TITLE } from '@/env';

import Container from './container';

export const metadata: Metadata = {
  title: `Popular Movies | ${TITLE}`,
  description: `Check out the most popular movies right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`
};

const Popular = () => <Container />;

export default Popular;
