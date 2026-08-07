import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import JsonLd from '@/components/JsonLd';
import detailsQuery from '@/data/queries/details';
import { SITE_URL, TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';
import { showPath } from '@/lib/utils';

import Container from './container';

interface Props {
  params: { id: string };
}

export const createShowMetadata =
  (showType: Show['type']) =>
  async ({ params: { id } }: Props): Promise<Metadata> => {
    const queryClient = getQueryClient();

    const showId = parseInt(id, 10);

    if (!showId) return notFound();

    try {
      const { title, overview, poster, backdrop } = await queryClient.fetchQuery(detailsQuery({ showId, showType }));

      const path = showPath({ type: showType, id: showId, title });

      return {
        title: `${title} | ${TITLE}`,
        description: overview,
        alternates: { canonical: path },
        openGraph: {
          title,
          description: overview,
          siteName: TITLE,
          images: [backdrop || poster['2x']],
          type: showType === 'movie' ? 'video.movie' : 'video.tv_show',
          url: path
        }
      };
    } catch (_) {
      return notFound();
    }
  };

export const createShowPage = (showType: Show['type']) => {
  const ShowPage = async ({ params: { id } }: Props) => {
    const queryClient = getQueryClient();

    const showId = parseInt(id, 10);

    if (!showId) return notFound();

    const details = await queryClient.fetchQuery(detailsQuery({ showId, showType })).catch(() => null);

    if (!details) return notFound();

    const path = showPath({ type: showType, id: showId, title: details.title });

    if (decodeURIComponent(`/${showType}/${id}`) !== path) permanentRedirect(path);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': showType === 'movie' ? 'Movie' : 'TVSeries',
      name: details.title,
      description: details.overview || undefined,
      image: details.poster['2x'] || undefined,
      datePublished: details.release || undefined,
      genre: details.genres?.map(({ name }) => name),
      url: `${SITE_URL}${path}`,
      ...(showType === 'movie' && details.runtime ? { duration: `PT${details.runtime}M` } : {}),
      ...(details.imdb_id ? { sameAs: `https://www.imdb.com/title/${details.imdb_id}/` } : {}),
      ...(details.votes
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: Math.round(details.rating * 10) / 10,
              ratingCount: details.votes,
              bestRating: 10,
              worstRating: 0
            }
          }
        : {})
    };

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <JsonLd data={jsonLd} />
        <Container showId={showId} showType={showType} />
      </HydrationBoundary>
    );
  };

  return ShowPage;
};
