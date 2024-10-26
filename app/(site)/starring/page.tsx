import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import popularQuery from '@/api/queries/popular';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Starring = ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { actorId } = searchParams || {};

  queryClient.prefetchInfiniteQuery(popularQuery({ sortBy: 'vote_average.desc', starring: actorId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Starring;
