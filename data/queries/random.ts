import { createUniqueRandomGenerator } from '@/lib/utils';

import movieAdvisor from '../clients/movieAdvisor';
import mapMoviesSeriesResponseToShows from '../dto/Show';

const TOTAL_PAGES = 400;

export const generatePage = createUniqueRandomGenerator(TOTAL_PAGES);

const randomQuery = () => ({
  suspense: true,
  queryKey: ['random-movie'],
  initialPageParam: '1',
  queryFn: () =>
    movieAdvisor
      .get<TMDBPagination<Movie>>('/discover/movie', {
        params: {
          'vote_count.gte': 300,
          sort_by: 'popularity.desc',
          with_origin_country: 'UA|GB|JP|AU|US|IT|DE|FR',
          page: generatePage()
        }
      })
      .then(mapMoviesSeriesResponseToShows)
});

export default randomQuery;