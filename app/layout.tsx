import React, { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Jost } from 'next/font/google';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import { SITE_URL, TITLE } from '@/env';
import Providers from '@/providers';

import '@/styles/index.css';

export const metadata: Metadata = {
  title: `${TITLE} | Discover Your Next Favorite Movie`,
  description: `Explore a diverse selection of movies with ${TITLE}. Get random movie recommendations and find out top-rated, popular, and user-favorite films.`
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

const font = Jost({ subsets: ['latin', 'cyrillic'], weight: ['400'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' data-mode={theme}>
      <head>
        <meta name='theme-color' content={theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'white'} />

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

        <meta name='twitter:card' content={metadata.description!} />
        <meta name='twitter:url' content={SITE_URL} />
        <meta name='twitter:title' content={TITLE} />
        <meta name='twitter:description' content={metadata.description!} />
        <meta name='twitter:image' content={`${SITE_URL}/web-app-manifest-512x512.png`} />
        <meta name='twitter:creator' content='https://github.com/noisy5ilence' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={TITLE} />
        <meta property='og:description' content={metadata.description!} />
        <meta property='og:site_name' content={TITLE} />
        <meta property='og:url' content={SITE_URL} />
        <meta property='og:image' content={`${SITE_URL}/apple-touch-icon.png`} />
      </head>
      <body className={font.className}>
        <Providers theme={theme}>
          <Header className='sticky top-0 z-20' />
          <main className='container'>{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
