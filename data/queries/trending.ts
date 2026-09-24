import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

export type TrendingQueryProps = {
  type: 'trending' | 'streaming' | 'theater' | 'apple' | 'netflix' | 'hbo';
  enabled?: boolean;
};

const TV_WATCH_PROVIDERS: Partial<Record<TrendingQueryProps['type'], number>> = {
  apple: 350,
  netflix: 8,
  hbo: 1899
};

const trendingQuery = ({ type, enabled }: TrendingQueryProps) => ({
  enabled,
  queryKey: ['trending', `type-${type}`],
  initialPageParam: '1',
  queryFn: ({ pageParam = '1' }: { pageParam?: string }) => {
    const provider = TV_WATCH_PROVIDERS[type];

    if (provider) {
      return movieAdvisor
        .get<TMDBPagination<Series>>('/discover/tv', {
          params: {
            page: pageParam,
            watch_region: 'US',
            with_watch_monetization_types: 'flatrate',
            with_watch_providers: provider
          }
        })
        .then((response) => mapMoviesSeriesResponseToShows(response, 'tv'));
    }

    const params: Record<string, string | number> = {
      page: pageParam
    };

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
      .then((response) => mapMoviesSeriesResponseToShows(response));
  }
});

export default trendingQuery;
