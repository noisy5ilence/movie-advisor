import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type SimilarQueryProps = {
  showId: Show['id'];
  showType: Show['type'];
  type?: 'similar' | 'recommendations';
};

const similarQuery = ({ showId, showType, type }: SimilarQueryProps) => ({
  queryKey: [type, showId, showType],
  queryFn: () =>
    movieAdvisor
      .get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/${showType}/${showId}/${type}`, {
        params: {
          page: 1
        }
      })
      .then((response) => mapMoviesSeriesResponseToShows(response, showType).results)
});

export default similarQuery;
