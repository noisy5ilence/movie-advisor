import React, { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import Providers from '@/providers';

import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Movie advisor | Discover Your Next Favorite Movie',
  description:
    'Explore a diverse selection of movies with Movie Advisor. Get random movie recommendations and find out top-rated, popular, and user-favorite films.'
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' className={theme}>
      <head>
        <meta name='theme-color' content='black' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        <link href='https://fonts.googleapis.com/css2?family=Moderustic&family=Poppins&display=swap' rel='stylesheet' />
      </head>
      <body>
        <Providers theme={theme}>
          <div className='sticky top-0 z-20'>
            <Header />
          </div>
          <main className='px-2 max-w-[1240px] mx-auto'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
