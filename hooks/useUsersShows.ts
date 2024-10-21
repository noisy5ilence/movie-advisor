'use client';

import { usersShows } from '@/api';

import useInfiniteList from './useInfiniteList';
import { useFavorites, useWatchList } from './useLocalUsersLists';
import { useSession } from './useSession';

export const KEY = ({ list, showType }: { showType: Show['type']; list: 'favorite' | 'watchlist' }) => [
  `users-${list}`,
  showType
];

const useUsersShows = ({ showType, list = 'favorite' }: { showType: Show['type']; list: 'favorite' | 'watchlist' }) => {
  const session = useSession();

  const { shows: favorite } = useFavorites();
  const { shows: watchlist } = useWatchList();

  const query = useInfiniteList({
    queryKey: KEY({ list, showType }),
    queryFn: ({ page }) => usersShows({ showType, list, page })
  });

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
