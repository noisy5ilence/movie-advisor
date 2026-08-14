import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import JsonLd from '@/components/JsonLd';
import popularQuery from '@/data/queries/popular';
import { TITLE } from '@/env';
import { itemList } from '@/lib/jsonLd';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

const HEADING = 'Popular Movies';

const DESCRIPTION = `Check out the most popular movies right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`;

export const metadata: Metadata = {
  title: `${HEADING} | ${TITLE}`,
  description: DESCRIPTION,
  alternates: { canonical: '/popular' },
  openGraph: {
    type: 'website',
    siteName: TITLE,
    title: HEADING,
    description: DESCRIPTION,
    url: '/popular'
  },
  twitter: {
    title: HEADING,
    description: DESCRIPTION
  }
};

const Popular = async () => {
  const queryClient = getQueryClient();

  const query = popularQuery();

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

export default Popular;
