import React, { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import Providers from '@/providers';

import '@/styles/index.css';

const title = 'Movie Advisor';

export const metadata: Metadata = {
  title: `${title} | Discover Your Next Favorite Movie`,
  description: `Explore a diverse selection of movies with ${title}. Get random movie recommendations and find out top-rated, popular, and user-favorite films.`
};

export const viewport: Viewport = {
  width: 'device-width'
};

const font = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' data-mode={theme}>
      <head>
        <meta name='theme-color' content={theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'white'} />

        <link rel='icon' type='image/png' href='/favicon-48x48.png' sizes='48x48' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <meta name='apple-mobile-web-app-title' content='Movie Advisor' />

        <link rel='manifest' href='/manifest.json' />

        <meta name='twitter:card' content={metadata.description!} />
        <meta name='twitter:url' content={process.env.NEXT_PUBLIC_VERCEL_URL} />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={metadata.description!} />
        <meta name='twitter:image' content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/web-app-manifest-512x512.png`} />
        <meta name='twitter:creator' content='https://github.com/noisy5ilence' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={metadata.description!} />
        <meta property='og:site_name' content={title} />
        <meta property='og:url' content={process.env.NEXT_PUBLIC_VERCEL_URL} />
        <meta property='og:image' content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/apple-touch-icon.png`} />
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
