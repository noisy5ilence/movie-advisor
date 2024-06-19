import { useInfiniteQuery } from '@tanstack/react-query';

import { search } from '@/lib/api';

const useSearch = ({ query, type }: { query: string; type: ShowType }) => {
  return useInfiniteQuery({
    queryKey: ['search', query, type],
    queryFn: ({ pageParam: page }) => search({ query, page, type }),
    enabled: Boolean(query),
    getNextPageParam(lastPage) {
      const { page, total_pages } = lastPage as { page: number; total_pages: number };
      if (page === total_pages) return undefined;

      return page + 1;
    },
    initialPageParam: 1
  });
};

export default useSearch;
