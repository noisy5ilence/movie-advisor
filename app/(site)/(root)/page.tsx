import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';

import JsonLd from '@/components/JsonLd';
import randomQuery, { generatePage } from '@/data/queries/random';
import { SITE_URL, TITLE } from '@/env';
import getQueryClient from '@/lib/queryClient';
import { parseShowType } from '@/lib/showType';

import Container from './container';

interface SearchParams {
  type?: string;
}

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

const Random = async ({ searchParams }: { searchParams: SearchParams }) => {
  const queryClient = getQueryClient();

  const type = parseShowType(searchParams.type);
  const page = generatePage(type);

  await queryClient.prefetchInfiniteQuery(randomQuery({ page, type }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: TITLE, url: SITE_URL }} />
      <h1 className='sr-only'>{TITLE} — Discover Your Next Favorite Movie</h1>
      <Container page={page} type={type} />
      <section className='sr-only'>
        <h2>Discover your next favorite movie</h2>
        <p>
          {TITLE} helps you decide what to watch: spin through random movie and series recommendations right on this
          page, browse the{' '}
          <Link className='underline underline-offset-2' href='/popular'>
            most popular movies
          </Link>{' '}
          everyone is talking about, or dive into the{' '}
          <Link className='underline underline-offset-2' href='/top'>
            top-rated films
          </Link>{' '}
          of all time. Open any title to see its rating, overview, cast, and similar shows — and keep favorites and a
          watchlist so you never lose track of what to watch next.
        </p>
      </section>
    </HydrationBoundary>
  );
};

export const revalidate = 1;

export default Random;
