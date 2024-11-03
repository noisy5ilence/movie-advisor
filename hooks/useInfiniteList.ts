import { useMemo } from 'react';
import { QueryKey, useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface Props {
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: string }) => Promise<Pagination<Show>>;
  initialPageParam?: string;
  getNextPageParam?: () => string | undefined;
}

const useInfiniteList = ({ queryKey, queryFn, initialPageParam, getNextPageParam }: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetched, isLoading } = useSuspenseInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ pageParam }),
    getNextPageParam:
      getNextPageParam ||
      ((pagination) => {
        if (!pagination || pagination.page === pagination.total) return undefined;

        return `${pagination.page + 1}`;
      }),
    initialPageParam: initialPageParam ?? '1'
  });

  const shows = useMemo(() => {
    return (
      data?.pages.reduce<Show[]>((shows, page) => {
        shows.push(...page.results);
        return shows;
      }, []) || []
    );
  }, [data?.pages]);

  return { shows, fetchNextPage: hasNextPage ? fetchNextPage : undefined, isFetched, isLoading };
};

export default useInfiniteList;
