import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { similarShows } from '@/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Similar = async ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { id, type } = searchParams || {};

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['similar', id, type],
    queryFn: () => similarShows({ showId: id, showType: type as Show['type'] }),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Similar;
