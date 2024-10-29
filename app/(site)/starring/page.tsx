import { FC } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import popularQuery from '@/data/queries/popular';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

interface Props {
  searchParams: Record<string, string>;
}

const Starring: FC<Props> = ({ searchParams }) => {
  const queryClient = getQueryClient();

  const { actorId } = searchParams || {};

  queryClient.prefetchInfiniteQuery(
    popularQuery({
      sortBy: 'vote_average.desc',
      starring: actorId
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Starring;
