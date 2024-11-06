import { FC } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import detailsQuery from '@/data/queries/details';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

interface Props {
  params: { show: [Show['type'], Show['id']] };
}

const ShowPage: FC<Props> = async ({ params: { show } }) => {
  const queryClient = getQueryClient();

  const [showType, showId] = show as [Show['type'], Show['id']];

  if (!showType || !showId) return redirect('/');

  try {
    await queryClient.fetchQuery(detailsQuery({ showId, showType }));
  } catch (_) {
    return redirect('/');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container showId={showId} showType={showType} />
    </HydrationBoundary>
  );
};

export default ShowPage;
