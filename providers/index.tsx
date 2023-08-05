'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

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
      <ReactQueryStreamedHydration>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
};

export default Providers;
