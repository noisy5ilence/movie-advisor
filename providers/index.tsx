'use client';

import { FC, ReactNode, useState } from 'react';
import ModalContainer from 'react-modal-promise';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/toaster';
import { queryClientOptions } from '@/lib/queryClient';

import ThemeProvider from './Theme';

interface Props {
  children: ReactNode;
  theme?: Theme;
}

const Providers: FC<Props> = ({ children, theme }) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
      <ModalContainer exitTimeout={500} enterTimeout={0} />
      <Toaster />
    </QueryClientProvider>
  );
};

export default Providers;
