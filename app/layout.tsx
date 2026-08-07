import React, { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Jost } from 'next/font/google';

import Header from '@/components/Header';
import ThemeColor from '@/components/ThemeColor';
import { SITE_URL, TITLE } from '@/env';
import Providers from '@/providers';

import '@/styles/index.css';

const DESCRIPTION = `Explore a diverse selection of movies with ${TITLE}. Get random movie recommendations and find out top-rated, popular, and user-favorite films.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${TITLE} | Discover Your Next Favorite Movie`,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION
  },
  twitter: {
    card: 'summary_large_image'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: 'white'
};

const font = Jost({ subsets: ['latin', 'cyrillic'], weight: ['400'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://image.tmdb.org' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://image.tmdb.org' />
        <ThemeColor />
        <link
          rel='icon'
          type='image/png'
          href='/favicon-48x48.png'
          sizes='48x48'
          media='(prefers-color-scheme: light)'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon-48x48-dark.png'
          sizes='48x48'
          media='(prefers-color-scheme: dark)'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' media='(prefers-color-scheme: light)' />
        <link rel='icon' type='image/svg+xml' href='/favicon-dark.svg' media='(prefers-color-scheme: dark)' />
        <link rel='shortcut icon' href='/favicon.ico' media='(prefers-color-scheme: light)' />
        <link rel='shortcut icon' href='/favicon-dark.ico' media='(prefers-color-scheme: dark)' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <meta name='apple-mobile-web-app-title' content={TITLE} />

        <link rel='manifest' href='/manifest.json' />
      </head>
      <body className={font.className}>
        <Providers>
          <Header className='sticky top-0 z-20' />
          <main className='container'>{children}</main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
