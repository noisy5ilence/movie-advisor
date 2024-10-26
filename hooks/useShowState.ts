import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { accountStates, updateAccountStates } from '@/api';

import { useFavorites, useFavoritesStateToggle, useWatchList, useWatchListStateToggle } from './useLocalUsersLists';
import { useSession } from './useSession';
import { KEY as USERS_SHOWS_KEY } from '@/api/queries/usersShows';

const KEY = ['show-state'];

const useShowState = ({ showId, showType = 'movie' }: { showId?: Show['id']; showType?: Show['type'] }) => {
  const session = useSession();

  const { map: favorites } = useFavorites();
  const { map: watchList } = useWatchList();

  const query = useQuery({
    enabled: Boolean(session && showId && showType),
    queryKey: KEY.concat(showId!.toString(), showType),
    queryFn: () => accountStates({ showId: showId!, showType }),
    notifyOnChangeProps: ['data'],
    staleTime: Infinity
  });

  return session ? query.data : { id: showId, watchlist: watchList.has(showId!), favorite: favorites.has(showId!) };
};

export const useMutateShowState = (show: Show) => {
  const session = useSession();

  const { toggle: toggleFavorite } = useFavoritesStateToggle(show);
  const { toggle: toggleWatchList } = useWatchListStateToggle(show);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateAccountStates,
    onMutate({ showId, showType, list, value }) {
      const key = KEY.concat(showId.toString(), showType);

      const snapshot = queryClient.getQueryData<ShowState>(key);

      queryClient.setQueryData<ShowState>(key, (state) => ({ ...state, [list]: value }) as ShowState);

      return snapshot;
    },
    onError(_, { showId, showType }, snapshot) {
      const key = KEY.concat(showId.toString(), showType);

      queryClient.setQueryData<ShowState>(key, snapshot);
    },
    onSuccess(_, { list, showType }) {
      queryClient.invalidateQueries({ queryKey: USERS_SHOWS_KEY({ list, showType, session }), refetchType: 'all' });
    }
  });

  return {
    list: mutation.variables?.list,
    isPending: session ? mutation.isPending : false,
    mutate: ({ list, value }: { list: 'favorite' | 'watchlist'; value: boolean }) => {
      if (session) return mutation.mutate({ showId: show.id, showType: show.type, list, value });

      if (list === 'favorite') return toggleFavorite();

      return toggleWatchList();
    }
  };
};

export default useShowState;
