import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import { session } from '@/api';
import usersShowsQuery from '@/api/queries/usersShows';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: 'My watch list - Movie Advisor',
  description:
    'View your favorite shows on Movie Advisor. Keep track of films you’ve added and revisit your top picks anytime.'
};

const WatchList = () => {
  const queryClient = getQueryClient();

  const list = 'watchlist';
  const showType = 'movie';

  queryClient.prefetchInfiniteQuery(usersShowsQuery({ showType, list, session: session() }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default WatchList;
