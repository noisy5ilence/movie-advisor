import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import randomQuery from '@/api/queries/random';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Random = () => {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(randomQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Random;
