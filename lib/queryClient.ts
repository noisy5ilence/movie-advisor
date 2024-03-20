import { cache } from 'react';
import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnMount: false
    }
  }
};

const getQueryClient = cache(() => new QueryClient(queryClientOptions));
export default getQueryClient;
