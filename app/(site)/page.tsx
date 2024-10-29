import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import randomQuery from '@/data/queries/random';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const Random = () => {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(randomQuery());

  return (
    <ReactQueryStreamedHydration>
      <Container />
    </ReactQueryStreamedHydration>
  );
};

export default Random;
