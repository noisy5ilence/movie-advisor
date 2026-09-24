import { createUniqueRandomGenerator } from '@/lib/utils';

import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

// Pools are bounded by the discover API total_pages (movie: ~500+, tv: ~77).
const TOTAL_PAGES: Record<Show['type'], number> = { movie: 400, tv: 70 };

const generators = {} as Record<Show['type'], () => number>;

const getGenerator = (type: Show['type']) => (generators[type] ??= createUniqueRandomGenerator(TOTAL_PAGES[type]));

export const generatePage = (type: Show['type'] = 'movie') => getGenerator(type)();

export type RandomQueryProps = {
  page: number;
  type: Show['type'];
};

const randomQuery = ({ page, type }: RandomQueryProps) => ({
  queryKey: ['random-movie', type],
  initialPageParam: page.toString(),
  getNextPageParam: () => generatePage(type).toString(),
  queryFn: async ({ pageParam }: { pageParam: string }) => {
    const params = {
      'vote_count.gte': 300,
      sort_by: 'popularity.desc',
      with_origin_country: 'UA|GB|JP|AU|US|IT|DE|FR',
      page: pageParam
    };

    const data = await movieAdvisor.get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/discover/${type}`, {
      params
    });

    if (data.results.length || !data.total_pages) {
      return mapMoviesSeriesResponseToShows(data, type);
    }

    // Out-of-range random page: TMDB returns empty results, retry with a valid page
    const fallback = await movieAdvisor.get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/discover/${type}`, {
      params: { ...params, page: Math.floor(Math.random() * data.total_pages) + 1 }
    });

    return mapMoviesSeriesResponseToShows(fallback, type);
  }
});

export default randomQuery;
