import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { TITLE } from '@/env';

import PopularContent from './content';

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

interface SearchParams {
  type?: string;
}

const Popular = async ({ searchParams }: { searchParams: SearchParams }) => {
  if (searchParams.type === 'tv') redirect('/series/popular');

  return <PopularContent type='movie' />;
};

export const revalidate = 3600;

export default Popular;
