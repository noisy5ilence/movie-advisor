import { useCallback, useMemo } from 'react';
import { QueryKey, useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';

import analytics from '@/lib/analytics';
import type { ListName } from '@/lib/analytics/events';

interface Props {
  enabled?: boolean;
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: string }) => Promise<Pagination<Show>>;
  initialPageParam?: string;
  getNextPageParam?: () => string | undefined;
  mode?: 'suspense' | 'default';
  list?: ListName;
}

const useInfiniteList = ({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
  mode = 'suspense',
  enabled,
  list
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

  const pages = data?.pages.length ?? 0;

  const loadNextPage = useCallback(() => {
    if (list) analytics.listLoadedMore({ list, page: pages + 1 });

    return fetchNextPage();
  }, [list, pages, fetchNextPage]);

  return { shows, fetchNextPage: hasNextPage ? loadNextPage : undefined, isFetched, isLoading };
};

export default useInfiniteList;
