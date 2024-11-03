import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type SimilarQueryProps = {
  showId: string;
  showType: Show['type'];
};

const similarQuery = ({ showId, showType }: SimilarQueryProps) => ({
  queryKey: ['similar', showId, showType],
  initialPageParam: '1',
  queryFn: ({ pageParam = '1' }: { pageParam?: string }) =>
    movieAdvisor
      .get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/${showType}/${showId}/recommendations`, {
        params: {
          page: pageParam
        }
      })
      .then((response) => mapMoviesSeriesResponseToShows(response, showType))
});

export default similarQuery;
