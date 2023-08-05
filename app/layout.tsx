import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import Providers from '@/providers';

import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Movie advisor',
  description: 'It will help you find a movie for evening'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' className={theme}>
      <body>
        <Providers theme={theme}>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
