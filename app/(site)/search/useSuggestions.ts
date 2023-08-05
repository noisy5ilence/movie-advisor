import { useInfiniteQuery } from '@tanstack/react-query';

import API from '@/app/(site)/search/api';

const useSuggestions = ({ description }: { description: string }) => {
  return useInfiniteQuery({
    enabled: Boolean(description),
    queryKey: ['suggestions', description],
    queryFn: () =>
      API.search.byDescription({ description }).then((movies) => {
        return { page: 1, results: movies, total_pages: 1, total_results: movies.length } as MovieDBResponse;
      }),
    defaultPageParam: 1,
    getNextPageParam() {
      return undefined;
    }
  });
};

export default useSuggestions;
