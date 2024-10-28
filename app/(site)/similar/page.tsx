import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import similarQuery from '@/data/queries/similar';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Similar = async ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { id, type } = searchParams || {};

  await queryClient.prefetchInfiniteQuery(similarQuery({ showId: id, showType: type as Show['type'] }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Similar;
