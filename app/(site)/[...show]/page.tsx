import { FC } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import detailsQuery from '@/data/queries/details';
import { SITE_URL, TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

interface Props {
  params: { show: [Show['type'], Show['id']] };
}

export const generateMetadata = async ({ params: { show } }: Props): Promise<Metadata> => {
  const queryClient = getQueryClient();

  const [showType, showId] = show as [Show['type'], Show['id']];

  if (!showType || !showId) return redirect('/');

  try {
    const { title, overview, poster } = await queryClient.fetchQuery(detailsQuery({ showId, showType }));

    return {
      title: `${title} | ${TITLE}`,
      description: overview,
      openGraph: {
        title: `${title} | ${TITLE}`,
        description: overview,
        images: [poster['2x']],
        type: 'website',
        url: `${SITE_URL}/${showType}/${showId}`
      }
    };
  } catch (_) {
    return redirect('/');
  }
};

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
