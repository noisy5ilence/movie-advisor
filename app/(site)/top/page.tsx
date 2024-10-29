import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import popularQuery from '@/data/queries/popular';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: `Top Rated Movies | ${TITLE}`,
  description: `Discover the top-rated movies on ${TITLE}. Find the highest-rated films and make informed viewing choices.`
};

const Top = () => {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(popularQuery({ sortBy: 'vote_average.desc' }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Top;
