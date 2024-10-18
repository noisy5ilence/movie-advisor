import { usersShows } from '@/api';
import useInfiniteList from './useInfiniteList';
import { useSession } from './useSession';

const useFavorites = ({
  showType,
  listType = 'favorites'
}: {
  showType: Show['type'];
  listType: 'favorites' | 'watchlist';
}) => {
  const session = useSession();

  return useInfiniteList({
    queryKey: [`users-${listType}`, showType],
    queryFn: () => usersShows({ showType, listType }),
    enabled: Boolean(session)
  });
};

export default useFavorites;
