'use client';

import { ReactNode, useState } from 'react';
import ModalContainer from 'react-modal-promise';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClientOptions } from '@/lib/queryClient';
import ThemeProvider from '@/providers/Theme';

const Providers = ({ children, theme }: { children: ReactNode; theme?: Theme }) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
      <ModalContainer />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default Providers;
