import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import { popularMovies } from '@/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: 'Popular Movies | Movie Advisor',
  description:
    'Check out the most popular movies right now on Movie Advisor. See what’s trending and don’t miss out on the latest hits.'
};

const Popular = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['popular'],
    queryFn: () => popularMovies(),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Popular;
