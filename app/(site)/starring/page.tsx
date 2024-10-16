import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { topMovies } from '@/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Starring = async ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { actorId } = searchParams || {};

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['starring', actorId],
    queryFn: () => topMovies({ starring: actorId }),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Starring;
