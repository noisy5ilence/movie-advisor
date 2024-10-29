import popularQuery from '@/data/queries/popular';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Starring = ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { actorId } = searchParams || {};

  queryClient.prefetchInfiniteQuery(popularQuery({ sortBy: 'vote_average.desc', starring: actorId }));

  return <Container />;
};

export default Starring;
