'use client';

import usersShowsQuery from '@/data/queries/usersShows';
import useMounted from '@/hooks/useMounted';

import useInfiniteList from './useInfiniteList';
import { useFavorites, useWatchList } from './useLocalUsersLists';
import { useSession } from './useSession';

const useUsersShows = ({
  showType,
  list = 'favorite',
  session: serverSession
}: {
  showType: Show['type'];
  list: 'favorite' | 'watchlist';
  session?: string;
}) => {
  const isMounted = useMounted();
  const clientSession = useSession();

  const session = isMounted ? clientSession : serverSession;

  const { shows: favorite } = useFavorites();
  const { shows: watchlist } = useWatchList();

  const query = useInfiniteList({
    ...usersShowsQuery({ showType, list, session }),
    enabled: Boolean(session)
  });

  return session
    ? query
    : {
        fetchNextPage: undefined,
        isLoading: isMounted,
        isFetched: isMounted,
        shows: isMounted
          ? {
              favorite: favorite.filter((show) => show.type === showType),
              watchlist: watchlist.filter((show) => show.type === showType)
            }[list]
          : []
      };
};

export default useUsersShows;
