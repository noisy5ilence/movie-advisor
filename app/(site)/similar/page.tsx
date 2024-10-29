import { FC } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import similarQuery from '@/data/queries/similar';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

interface Props {
  searchParams: { id: string; type: Show['type'] };
}

const Similar: FC<Props> = ({ searchParams }) => {
  const queryClient = getQueryClient();

  const { id, type } = searchParams || {};

  queryClient.prefetchInfiniteQuery(similarQuery({ showId: id, showType: type }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export default Similar;
