import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { topMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export default async function Starring({ searchParams }: { searchParams: Record<string, string> }) {
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
}

export const revalidate = 3600;
