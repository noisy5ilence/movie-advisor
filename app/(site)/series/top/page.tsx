import { Metadata } from 'next';

import TopContent from '@/app/(site)/top/content';
import { TITLE } from '@/env';

const HEADING = 'Top Rated Series';

const DESCRIPTION = `Discover the top-rated series on ${TITLE}. Find the highest-rated shows and make informed viewing choices.`;

export const metadata: Metadata = {
  title: `${HEADING} | ${TITLE}`,
  description: DESCRIPTION,
  alternates: { canonical: '/series/top' },
  openGraph: {
    type: 'website',
    siteName: TITLE,
    title: HEADING,
    description: DESCRIPTION,
    url: '/series/top'
  },
  twitter: {
    title: HEADING,
    description: DESCRIPTION
  }
};

const Top = () => <TopContent type='tv' />;

export const revalidate = 3600;

export default Top;
