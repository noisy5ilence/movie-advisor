import similarQuery from '@/data/queries/similar';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Similar = ({ searchParams }: { searchParams: Record<string, string> }) => {
  const queryClient = getQueryClient();

  const { id, type } = searchParams || {};

  queryClient.prefetchInfiniteQuery(similarQuery({ showId: id, showType: type as Show['type'] }));

  return <Container />;
};

export default Similar;
