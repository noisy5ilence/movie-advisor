import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { topMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const queryClient = getQueryClient();

queryClient.prefetchInfiniteQuery({
  queryKey: ['top'],
  queryFn: () => topMovies(),
  initialPageParam: '1'
});

export default async function Top() {
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
