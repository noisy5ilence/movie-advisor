import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { randomMovies } from '@/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Random = () => {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ['random-movie'],
    queryFn: randomMovies,
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Random;
