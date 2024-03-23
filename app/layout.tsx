import React, { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import Providers from '@/providers';

import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Movie advisor',
  description: 'It is going to help you find a movie for evening'
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
      </head>
      <body>
        <Providers theme={theme}>
          <Header />
          <main className='px-2 max-w-[1260px] mx-auto'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
