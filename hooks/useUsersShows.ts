'use client';

import useInfiniteList from './useInfiniteList';
import { useFavorites, useWatchList } from './useLocalUsersLists';
import { useSession } from './useSession';
import usersShowsQuery from '@/api/queries/usersShows';

const useUsersShows = ({ showType, list = 'favorite' }: { showType: Show['type']; list: 'favorite' | 'watchlist' }) => {
  const session = useSession();

  const { shows: favorite } = useFavorites();
  const { shows: watchlist } = useWatchList();

  const query = useInfiniteList(usersShowsQuery({ showType, list, session }));

  return session
    ? query
    : {
        fetchNextPage: undefined,
        isLoading: false,
        isFetched: true,
        shows: {
          favorite: favorite.filter((show) => show.type === showType),
          watchlist: watchlist.filter((show) => show.type === showType)
        }[list]
      };
};

export default useUsersShows;
