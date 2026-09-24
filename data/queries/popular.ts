import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type PopularQueryProps = {
  sortBy?: string;
  type?: Show['type'];
};

const popularQuery = ({ sortBy = 'popularity.desc', type = 'movie' }: PopularQueryProps = {}) => ({
  queryKey: ['popular', type, sortBy],
  initialPageParam: '1',
  queryFn: ({ pageParam = '1' }: { pageParam?: string }) =>
    movieAdvisor
      .get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/discover/${type}`, {
        params: {
          page: pageParam,
          sort_by: sortBy,
          'vote_count.gte': 300,
          'vote_average.lte': 10,
          'vote_average.gte': 5
        }
      })
      .then((response) => mapMoviesSeriesResponseToShows(response, type))
});

export default popularQuery;
