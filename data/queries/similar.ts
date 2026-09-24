import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type SimilarQueryProps = {
  showId: Show['id'];
  showType: Show['type'];
  type?: 'similar' | 'recommendations';
};

const similarQuery = ({ showId, showType, type }: SimilarQueryProps) => ({
  queryKey: [type, showId, showType],
  initialPageParam: '1',
  queryFn: ({ pageParam = '1' }: { pageParam?: string }) =>
    movieAdvisor
      .get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/${showType}/${showId}/${type}`, {
        params: {
          page: pageParam
        }
      })
      .then((response) => mapMoviesSeriesResponseToShows(response, showType))
});

export default similarQuery;
