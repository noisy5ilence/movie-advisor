import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type PopularQueryProps = {
  sortBy?: string;
  starring?: string;
};

const popularQuery = ({ sortBy = 'popularity.desc', starring }: PopularQueryProps = {}) => ({
  suspense: true,
  queryKey: ['popular', sortBy, starring],
  initialPageParam: '1',
  queryFn: ({ pageParam = '1' }: { pageParam?: string }) =>
    movieAdvisor
      .get<TMDBPagination<Movie>>('/discover/movie', {
        params: {
          page: pageParam,
          sort_by: sortBy,
          with_cast: starring,
          with_people: starring,
          'vote_count.gte': 300,
          'vote_average.lte': 10,
          'vote_average.gte': 5
        }
      })
      .then(mapMoviesSeriesResponseToShows)
});

export default popularQuery;
