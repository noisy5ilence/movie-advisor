import { Metadata } from 'next';

import PopularContent from '@/app/(site)/popular/content';
import { TITLE } from '@/env';

const HEADING = 'Popular Series';

const DESCRIPTION = `Check out the most popular series right now on ${TITLE}. See what’s trending and don’t miss out on the latest hits.`;

export const metadata: Metadata = {
  title: `${HEADING} | ${TITLE}`,
  description: DESCRIPTION,
  alternates: { canonical: '/series/popular' },
  openGraph: {
    type: 'website',
    siteName: TITLE,
    title: HEADING,
    description: DESCRIPTION,
    url: '/series/popular'
  },
  twitter: {
    title: HEADING,
    description: DESCRIPTION
  }
};

const Popular = () => <PopularContent type='tv' />;

export const revalidate = 3600;

export default Popular;
