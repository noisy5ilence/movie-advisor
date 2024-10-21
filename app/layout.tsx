import React, { ReactNode } from 'react';
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
  width: 'device-width'
};

const font = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' data-mode={theme}>
      <head>
        <meta name='theme-color' content={theme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'white'} />
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
