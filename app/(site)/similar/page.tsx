import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import similarQuery from '@/api/queries/similar';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Similar = ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { id, type } = searchParams || {};

  queryClient.prefetchInfiniteQuery(similarQuery({ showId: id, showType: type as Show['type'] }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Similar;
