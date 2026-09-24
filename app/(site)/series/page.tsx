import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import Container from '@/app/(site)/(root)/container';
import randomQuery, { generatePage } from '@/data/queries/random';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

export const metadata: Metadata = {
  alternates: { canonical: '/series' }
};

const Series = async () => {
  const queryClient = getQueryClient();

  const page = generatePage('tv');

  await queryClient.prefetchInfiniteQuery(randomQuery({ page, type: 'tv' }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className='sr-only'>{TITLE} — Discover Your Next Favorite Series</h1>
      <Container page={page} type='tv' />
    </HydrationBoundary>
  );
};

export const revalidate = 1;

export default Series;
