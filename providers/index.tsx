'use client';

import { FC, ReactNode } from 'react';
import ModalContainer from 'react-modal-promise';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import { Toaster } from '@/components/ui/toaster';
import getQueryClient from '@/lib/queryClient';

import ThemeProvider from './Theme';

interface Props {
  children: ReactNode;
  theme?: Theme;
}

const Providers: FC<Props> = ({ children, theme }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ReactQueryStreamedHydration>
      <ModalContainer exitTimeout={0} enterTimeout={0} />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
