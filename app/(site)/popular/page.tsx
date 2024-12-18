import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import popularQuery from '@/data/queries/popular';
import { TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';

import Container from './container';

export const metadata: Metadata = {
  title: `Popular Movies | ${TITLE}`,
  description: `Check out the most popular movies right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`
};

const Popular = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(popularQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
};

export const revalidate = 3600;

export default Popular;
