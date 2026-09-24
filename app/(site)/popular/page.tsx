import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import JsonLd from '@/components/JsonLd';
import popularQuery from '@/data/queries/popular';
import { TITLE } from '@/env';
import { itemList } from '@/lib/jsonLd';
import getQueryClient from '@/lib/queryClient';
import { parseShowType } from '@/lib/showType';

import Container from './container';

interface SearchParams {
  type?: string;
}

const heading = (type: Show['type']) => (type === 'tv' ? 'Popular Series' : 'Popular Movies');

const description = (type: Show['type']) =>
  type === 'tv'
    ? `Check out the most popular series right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`
    : `Check out the most popular movies right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`;

export const generateMetadata = ({ searchParams }: { searchParams: SearchParams }): Metadata => {
  const type = parseShowType(searchParams.type);
  const title = heading(type);
  const text = description(type);

  return {
    title: `${title} | ${TITLE}`,
    description: text,
    alternates: { canonical: '/popular' },
    openGraph: {
      type: 'website',
      siteName: TITLE,
      title,
      description: text,
      url: '/popular'
    },
    twitter: {
      title,
      description: text
    }
  };
};

const Popular = async ({ searchParams }: { searchParams: SearchParams }) => {
  const queryClient = getQueryClient();

  const type = parseShowType(searchParams.type);
  const query = popularQuery({ type });

  await queryClient.prefetchInfiniteQuery(query);

  const shows = queryClient
    .getQueryData<{ pages: Pagination<Show>[] }>(query.queryKey)
    ?.pages.flatMap(({ results }) => results);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {Boolean(shows?.length) && <JsonLd data={itemList(shows!)} />}
      <h1 className='sr-only'>{heading(type)}</h1>
      <Container />
    </HydrationBoundary>
  );
};

export const revalidate = 3600;

export default Popular;
