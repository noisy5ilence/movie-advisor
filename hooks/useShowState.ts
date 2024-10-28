import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import statesMutation from '@/data/mutations/accountStates';
import statesQuery from '@/data/queries/accountStates';
import { KEY as USERS_SHOWS_KEY } from '@/data/queries/usersShows';

import { useFavorites, useFavoritesStateToggle, useWatchList, useWatchListStateToggle } from './useLocalUsersLists';
import { useSession } from './useSession';

const useShowState = ({ showId, showType = 'movie' }: { showId?: Show['id']; showType?: Show['type'] }) => {
  const session = useSession();

  const { map: favorites } = useFavorites();
  const { map: watchList } = useWatchList();

  const query = useQuery(statesQuery({ showId, showType, session }));

  return session ? query.data : { id: showId, watchlist: watchList.has(showId!), favorite: favorites.has(showId!) };
};

export const useMutateShowState = (show: Show) => {
  const session = useSession();

  const { toggle: toggleFavorite } = useFavoritesStateToggle(show);
  const { toggle: toggleWatchList } = useWatchListStateToggle(show);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...statesMutation({ session }),
    onMutate({ showId, showType, list, value }) {
      const key = statesQuery({ showId, showType, session }).queryKey;

      const snapshot = queryClient.getQueryData<ShowState>(key);

      queryClient.setQueryData<ShowState>(key, (state) => ({ ...state, [list]: value }) as ShowState);

      return snapshot;
    },
    onError(_, { showId, showType }, snapshot) {
      const key = statesQuery({ showId, showType, session }).queryKey;

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
