import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import JsonLd from '@/components/JsonLd';
import randomQuery, { generatePage } from '@/data/queries/random';
import { SITE_URL, TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

const Random = async () => {
  const queryClient = getQueryClient();

  const page = generatePage();

  await queryClient.prefetchInfiniteQuery(randomQuery({ page }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: TITLE, url: SITE_URL }} />
      <h1 className='sr-only'>{TITLE} — Discover Your Next Favorite Movie</h1>
      <Container page={page} />
    </HydrationBoundary>
  );
};

export const revalidate = 1;

export default Random;
