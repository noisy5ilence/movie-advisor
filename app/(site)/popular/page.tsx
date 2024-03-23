import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { popularMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const queryClient = getQueryClient();

queryClient.prefetchInfiniteQuery({
  queryKey: ['popular'],
  queryFn: () => popularMovies(),
  initialPageParam: '1'
});

export default function Popular() {
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
