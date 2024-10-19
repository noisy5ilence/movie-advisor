import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import { usersShows } from '@/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: 'My Favorite Shows - Movie Advisor',
  description:
    'View your favorite shows on Movie Advisor. Keep track of films you’ve added and revisit your top picks anytime.'
};

const Favorites = async () => {
  const queryClient = getQueryClient();

  const list = 'favorite';
  const showType = 'movie';

  await queryClient.prefetchInfiniteQuery({
    queryKey: [`users-${list}`, showType],
    queryFn: () => usersShows({ showType, list, page: '1' }),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Favorites;
