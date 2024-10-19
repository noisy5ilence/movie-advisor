import { usersShows } from '@/api';
import useInfiniteList from './useInfiniteList';
import { useSession } from './useSession';
import { useFavorites, useWatchList } from './useLocalUsersLists';

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
    queryFn: () => usersShows({ showType, list }),
    enabled: Boolean(session)
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
