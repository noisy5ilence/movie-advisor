import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import randomQuery from '@/data/queries/random';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Random = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(randomQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Random;
