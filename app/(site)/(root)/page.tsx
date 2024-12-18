import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import randomQuery, { generatePage } from '@/data/queries/random';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Random = async () => {
  const queryClient = getQueryClient();

  const page = generatePage();

  await queryClient.prefetchInfiniteQuery(randomQuery({ page }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container page={page} />
    </HydrationBoundary>
  );
};

export const revalidate = 1;

export default Random;
