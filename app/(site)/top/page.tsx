import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import JsonLd from '@/components/JsonLd';
import popularQuery from '@/data/queries/popular';
import { TITLE } from '@/env';
import { itemList } from '@/lib/jsonLd';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const HEADING = 'Top Rated Movies';

const DESCRIPTION = `Discover the top-rated movies on ${TITLE}. Find the highest-rated films and make informed viewing choices.`;

export const metadata: Metadata = {
  title: `${HEADING} | ${TITLE}`,
  description: DESCRIPTION,
  alternates: { canonical: '/top' },
  openGraph: {
    type: 'website',
    siteName: TITLE,
    title: HEADING,
    description: DESCRIPTION,
    url: '/top'
  },
  twitter: {
    title: HEADING,
    description: DESCRIPTION
  }
};

const Top = async () => {
  const queryClient = getQueryClient();

  const query = popularQuery({ sortBy: 'vote_average.desc' });

  await queryClient.prefetchInfiniteQuery(query);

  const shows = queryClient
    .getQueryData<{ pages: Pagination<Show>[] }>(query.queryKey)
    ?.pages.flatMap(({ results }) => results);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {Boolean(shows?.length) && <JsonLd data={itemList(shows!)} />}
      <h1 className='sr-only'>{HEADING}</h1>
      <Container />
    </HydrationBoundary>
  );
};

export const revalidate = 3600;

export default Top;
