import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import detailsQuery from '@/data/queries/details';
import { SITE_URL, TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

interface Props {
  params: { id: string };
}

export const createShowMetadata =
  (showType: Show['type']) =>
  async ({ params: { id } }: Props): Promise<Metadata> => {
    const queryClient = getQueryClient();

    try {
      const { title, overview, poster } = await queryClient.fetchQuery(detailsQuery({ showId: Number(id), showType }));

      return {
        title: `${title} | ${TITLE}`,
        description: overview,
        openGraph: {
          title,
          description: overview,
          images: [poster['2x']],
          type: 'website',
          url: `${SITE_URL}/${showType}/${id}`
        }
      };
    } catch (_) {
      return notFound();
    }
  };

export const createShowPage = (showType: Show['type']) => {
  const ShowPage = async ({ params: { id } }: Props) => {
    const queryClient = getQueryClient();

    const showId = Number(id);

    try {
      await queryClient.fetchQuery(detailsQuery({ showId, showType }));
    } catch (_) {
      return notFound();
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Container showId={showId} showType={showType} />
      </HydrationBoundary>
    );
  };

  return ShowPage;
};
