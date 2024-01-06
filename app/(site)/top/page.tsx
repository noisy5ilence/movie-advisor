import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { similarMovies, topMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export default async function Top({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = getQueryClient();

  const { starring, similar } = searchParams || {};

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['top', starring, similar],
    queryFn: () => (similar ? similarMovies({ movieId: similar }) : topMovies({ starring })),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}

export const revalidate = 3600;
