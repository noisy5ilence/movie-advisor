import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { randomMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export default async function Random() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['random-movie'],
    queryFn: () => randomMovies(),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
