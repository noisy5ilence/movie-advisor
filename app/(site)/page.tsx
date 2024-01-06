import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { randomMovies } from '@/lib/api';
import getQueryClient from '@/lib/queryClient';

import Container from './container';
import { mapFilters } from './useFilters';

export default async function Random({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = getQueryClient();

  const filters = mapFilters(searchParams || {});

  await queryClient.prefetchQuery({ queryKey: ['random-movie', filters], queryFn: () => randomMovies({ filters }) });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
