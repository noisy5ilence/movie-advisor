'use client';

import { FC, ReactNode } from 'react';
import ModalContainer from 'react-modal-promise';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/toaster';
import useIdentify from '@/hooks/useIdentify';
import getQueryClient from '@/lib/queryClient';

interface Props {
  children: ReactNode;
}

const Identify: FC = () => {
  useIdentify();

  return null;
};

const Providers: FC<Props> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Identify />
      <ThemeProvider attribute='data-mode'>{children}</ThemeProvider>
      <ModalContainer exitTimeout={0} enterTimeout={0} />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
