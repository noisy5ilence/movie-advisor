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

// One client per server request (React cache is request-scoped), so generateMetadata
// and the page share fetches instead of hitting TMDB twice for the same data.
const getServerQueryClient = cache(makeQueryClient);

const getQueryClient = () => {
  if (isServer) {
    try {
      return getServerQueryClient();
    } catch (_) {
      // cache() only works in the RSC runtime; the SSR pass of client components
      // (e.g. Providers) lands here and keeps its own per-render client as before
      return makeQueryClient();
    }
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
};

export default getQueryClient;
