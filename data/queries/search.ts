import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type SearchQueryProps = { query: string; type: Show['type'] };

const searchQuery = ({ query, type }: SearchQueryProps) => ({
  queryKey: ['search', query, type],
  queryFn: ({ pageParam }: { pageParam: string }) =>
    movieAdvisor
      .get<TMDBPagination<Movie>>(`/search/${type}`, { params: { page: pageParam, query } })
      .then((response) => mapMoviesSeriesResponseToShows(response, type)),
  enabled: Boolean(query)
});

export default searchQuery;
