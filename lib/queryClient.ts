import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false
      }
    }
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (isServer) return makeQueryClient();

  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
};

export default getQueryClient;
