import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { similarMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export default async function Similar({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = getQueryClient();

  const { movieId, type } = searchParams || {};

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['similar', movieId, type],
    queryFn: () => similarMovies({ movieId, type: type as ShowType }),
    initialPageParam: '1'
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}

export const revalidate = 3600;
