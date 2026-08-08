import { cache } from 'react';
import { isServer, QueryClient } from '@tanstack/react-query';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3600 * 1000,
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false
      }
    }
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

const getServerQueryClient = cache(makeQueryClient);

const getQueryClient = () => {
  if (isServer) {
    try {
      return getServerQueryClient();
    } catch (_) {
      return makeQueryClient();
    }
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
};

export default getQueryClient;
