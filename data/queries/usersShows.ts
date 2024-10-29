import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type UsersShowsQueryProps = {
  showType: Show['type'];
  list: 'favorite' | 'watchlist';
  session?: string | null;
};

export const KEY = ({ list, showType, session }: UsersShowsQueryProps) => [`users-${list}`, showType, session];

const usersShowsQuery = ({ showType, list, session }: UsersShowsQueryProps) => ({
  queryKey: KEY({ list, showType, session }),
  initialPageParam: '1',
  queryFn: ({ pageParam = '1' }: { pageParam?: string }) =>
    movieAdvisor
      .get<TMDBPagination<Movie>>(`/account/null/${list}/${showType === 'tv' ? 'tv' : 'movies'}`, {
        params: { page: pageParam, sort_by: 'created_at.desc', session_id: session },
        preventCache: true
      })
      .then((response) => mapMoviesSeriesResponseToShows(response, showType))
});

export default usersShowsQuery;
