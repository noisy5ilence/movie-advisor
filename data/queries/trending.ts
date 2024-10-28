import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type TrendingQueryProps = {
  type: 'trending' | 'streaming' | 'theater';
};

const trendingQuery = ({ type }: TrendingQueryProps) => ({
  queryKey: ['trending', `type-${type}`],
  queryFn: () => {
    const params: Record<string, string | number> = {};

    if (type !== 'trending') {
      params['watch_region'] = 'US';
    }

    if (type === 'theater') {
      params['with_release_type'] = 3;
    }

    if (type === 'streaming') {
      params['with_watch_monetization_types'] = 'flatrate';
    }

    return movieAdvisor
      .get<TMDBPagination<Movie>>(type === 'trending' ? '/trending/movie/day' : '/discover/movie', {
        params
      })
      .then((response) => {
        const data = mapMoviesSeriesResponseToShows(response);

        return data.results;
      });
  }
});

export default trendingQuery;
