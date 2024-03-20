import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import Providers from '@/providers';

import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Movie advisor',
  description: 'It is going to help you find a movie for evening'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' className={theme}>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        ></meta>
        <meta name='theme-color' content='black'></meta>
      </head>
      <body>
        <Providers theme={theme}>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
