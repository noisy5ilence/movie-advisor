import { useMemo } from 'react';
import { QueryKey, useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface Props {
  suspense?: boolean;
  queryKey: QueryKey;
  enabled?: boolean;
  queryFn: ({ page }: { page: string }) => Promise<Pagination<Show>>;
}

const useInfiniteList = ({ queryKey, queryFn, enabled, suspense }: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetched, isLoading } = (
    suspense ? useSuspenseInfiniteQuery : useInfiniteQuery
  )({
    enabled,
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ page: pageParam }),
    getNextPageParam(pagination) {
      if (!pagination || pagination.page === pagination.total) return undefined;

      return `${pagination.page + 1}`;
    },
    initialPageParam: '1'
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
