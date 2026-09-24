import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { TITLE } from '@/env';

import TopContent from './content';

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

interface SearchParams {
  type?: string;
}

const Top = async ({ searchParams }: { searchParams: SearchParams }) => {
  if (searchParams.type === 'tv') redirect('/series/top');

  return <TopContent type='movie' />;
};

export const revalidate = 3600;

export default Top;
