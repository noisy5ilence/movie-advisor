'use server';

import { createUniqueRandomGenerator } from '@/lib/utils';

import mapMoviesSeriesResponseToShows, { mapMovieSeriesToShow } from './dto/Show';
import pirateBay from './parsers/pirate-bay';
import yts from './parsers/yts';
import http from './Http';
import { Sort } from './parsers';

export const search = async ({
  query,
  page,
  type = 'movie'
}: {
  query: string;
  page: string;
  type: Show['type'];
}): Promise<Pagination<Show>> => {
  return http
    .get<TMDBPagination<Movie>>(`/search/${type}`, {
      params: {
        query,
        page
      }
    })
    .then((response) => mapMoviesSeriesResponseToShows(response, type));
};

const TOTAL_PAGES = 400;

const generatePage = createUniqueRandomGenerator(TOTAL_PAGES);

export const details = async ({
  showId,
  showType = 'movie'
}: {
  showId: Show['id'];
  showType: Show['type'];
}): Promise<Show & Details> => {
  return http
    .get<(Movie | Series) & Details>(`/${showType}/${showId}`)
    .then((response) => ({ ...response, ...mapMovieSeriesToShow(response, showType) }));
};

export const randomMovies = async (): Promise<Pagination<Show>> => {
  return http
    .get<TMDBPagination<Movie>>('/discover/movie', {
      params: {
        'vote_count.gte': 300,
        sort_by: 'popularity.desc',
        with_origin_country: 'UA|GB|JP|AU|US|IT|DE|FR',
        page: generatePage()
      }
    })
    .then(mapMoviesSeriesResponseToShows);
};

export const popularByType = async ({ type }: { type: 'streaming' | 'theater' | 'rent' }): Promise<Show[]> => {
  const params =
    type === 'theater'
      ? { with_release_type: 3 }
      : { with_watch_monetization_types: type === 'streaming' ? 'flatrate' : 'rent' };

  return http
    .get<TMDBPagination<Movie>>('/discover/movie', {
      params: {
        ...params,
        watch_region: 'US'
      }
    })
    .then((response) => {
      const data = mapMoviesSeriesResponseToShows(response);

      return data.results;
    });
};

export const popularMovies = async ({ page }: { page?: string } = {}): Promise<Pagination<Show>> => {
  return http
    .get<TMDBPagination<Movie>>('/discover/movie', {
      params: {
        page,
        sort_by: 'popularity.desc',
        'vote_count.gte': 300,
        'vote_average.lte': 10,
        'vote_average.gte': 0,
        'with_runtime.gte': 0,
        'with_runtime.lte': 400
      }
    })
    .then(mapMoviesSeriesResponseToShows);
};

export const trendingMovies = async ({ page }: { page?: string } = {}): Promise<Show[]> => {
  return http
    .get<TMDBPagination<Movie>>('/trending/movie/day', {
      params: {
        page
      }
    })
    .then((response) => {
      const data = mapMoviesSeriesResponseToShows(response);

      return data.results;
    });
};

export const topMovies = async ({ page, starring }: { page?: string; starring?: string } = {}): Promise<
  Pagination<Show>
> => {
  return http
    .get<TMDBPagination<Movie>>('/discover/movie', {
      params: {
        page,
        with_cast: starring,
        with_people: starring,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 300,
        'vote_average.lte': 10,
        'vote_average.gte': 0
      }
    })
    .then(mapMoviesSeriesResponseToShows);
};

export const similarShows = async ({
  page,
  showId,
  showType = 'movie'
}: {
  page?: string;
  showId: string;
  showType: Show['type'];
}): Promise<Pagination<Show>> => {
  return http
    .get<TMDBPagination<Movie> | TMDBPagination<Series>>(`/${showType}/${showId}/recommendations`, {
      params: {
        page
      }
    })
    .then((response) => mapMoviesSeriesResponseToShows(response, showType));
};

export const credits = async ({
  showId,
  showType = 'movie'
}: {
  showId: Show['id'];
  showType?: Show['type'];
}): Promise<Array<Actor>> => {
  return http
    .get<{ cast: Array<Actor | AggregatedActor> }>(
      `/${showType}/${showId}/${showType === 'tv' ? 'aggregate_credits' : 'credits'}`
    )
    .then(({ cast }) => {
      return cast
        .filter((person) => person.profile_path)
        .map((actor) => {
          const photoUrl = `https://image.tmdb.org/t/p/w500/${actor.profile_path}`;

          if ('character' in actor) return { ...actor, photoUrl };

          const [{ character }] = actor.roles || [{}];

          return { ...actor, character, photoUrl };
        });
    });
};

export const trailers = async ({
  showId,
  showType
}: {
  showId: Show['id'];
  showType?: Show['type'];
}): Promise<Trailer[]> => {
  return http
    .get<{ id: number; results: Trailer[] }>(`/${showType}/${showId}/videos`, {
      params: {
        language: 'en-US'
      }
    })
    .then((data) => data.results);
};

export const YTSTorrents = async ({ query, sort, imdbID }: { imdbID: string; query: string; sort: Sort }) => {
  try {
    return yts.search({
      imdbID,
      query,
      sort
    });
  } catch (error) {
    return [];
  }
};

export const TPBTorrents = async ({ query, sort }: { imdbID: string; query: string; sort: Sort }) => {
  try {
    return pirateBay.search({
      query,
      sort
    });
  } catch (error) {
    return [];
  }
};
