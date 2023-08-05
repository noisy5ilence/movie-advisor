import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import API from './api';

const useSearch = ({ query }: { query: string }) => {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: ({ pageParam: page }) => API.search.byTitle({ query, page }),
    enabled: Boolean(query),
    defaultPageParam: 1,
    getNextPageParam({ page, total_pages }) {
      if (page === total_pages) return undefined;

      return page + 1;
    }
  });
};

export default useSearch;
