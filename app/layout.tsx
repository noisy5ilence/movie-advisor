import React, { CSSProperties, ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
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

const font = Poppins({ subsets: ['latin'], weight: '400' });

const RootLayout = ({ children }: { children: ReactNode }) => {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' data-mode={theme}>
      <head>
        <meta name='theme-color' content='black' />
      </head>
      <body style={{ '--font-family': font.style.fontFamily, ...font.style } as CSSProperties}>
        <Providers theme={theme}>
          <Header className='sticky top-0 z-20' />
          <main className='container'>{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
