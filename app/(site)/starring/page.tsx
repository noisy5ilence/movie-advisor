import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import popularQuery from '@/data/queries/popular';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Starring = ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { actorId } = searchParams || {};

  queryClient.prefetchInfiniteQuery(popularQuery({ sortBy: 'vote_average.desc', starring: actorId }));

  return (
    <ReactQueryStreamedHydration>
      <Container />
    </ReactQueryStreamedHydration>
  );
};

export default Starring;
