import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import { topMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: 'Top Rated Movies | Movie Advisor',
  description:
    'Discover the top-rated movies on Movie Advisor. Find the highest-rated films and make informed viewing choices.'
};

export const revalidate = 3600;

export default async function Top() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['top'],
    queryFn: () => topMovies(),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
