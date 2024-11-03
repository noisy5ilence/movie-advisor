import { useMemo } from 'react';
import { QueryKey, useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface Props {
  enabled?: boolean;
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: string }) => Promise<Pagination<Show>>;
  initialPageParam?: string;
  getNextPageParam?: () => string | undefined;
  mode?: 'suspense' | 'default';
}

const useInfiniteList = ({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
  mode = 'suspense',
  enabled
}: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetched, isLoading } = (
    mode === 'suspense' ? useSuspenseInfiniteQuery : useInfiniteQuery
  )({
    enabled: mode === 'default' ? enabled : undefined,
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
