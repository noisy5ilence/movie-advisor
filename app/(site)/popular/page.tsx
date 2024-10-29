import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { Metadata } from 'next';

import popularQuery from '@/data/queries/popular';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: `Popular Movies | ${TITLE}`,
  description: `Check out the most popular movies right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`
};

const Popular = () => {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(popularQuery());

  return (
    <ReactQueryStreamedHydration>
      <Container />
    </ReactQueryStreamedHydration>
  );
};

export default Popular;
