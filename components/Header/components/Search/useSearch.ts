import { search } from '@/api';
import useInfiniteList from '@/hooks/useInfiniteList';

const useSearch = ({ query, type }: { query: string; type: Show['type'] }) =>
  useInfiniteList({
    queryKey: ['search', query, type],
    queryFn: ({ page }) => search({ query, page, type }),
    enabled: Boolean(query)
  });

export default useSearch;
