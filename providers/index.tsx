'use client';

import { ReactNode, useState } from 'react';
import ModalContainer from 'react-modal-promise';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ThemeProvider from '@/providers/Theme';

const Providers = ({ children, theme }: { children: ReactNode; theme?: Theme }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: Number.POSITIVE_INFINITY
          }
        }
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
      <ModalContainer />
    </QueryClientProvider>
  );
};

export default Providers;
