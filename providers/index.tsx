'use client';

import { FC, ReactNode } from 'react';
import ModalContainer from 'react-modal-promise';
import { QueryClientProvider } from '@tanstack/react-query';

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
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
      <ModalContainer exitTimeout={500} enterTimeout={0} />
      <Toaster />
    </QueryClientProvider>
  );
};

export default Providers;
