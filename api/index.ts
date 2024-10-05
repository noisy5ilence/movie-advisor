'use server';

import { createUniqueRandomGenerator } from '../lib/utils';

import mapMoviesSeriesResponseToShows from './dto/Show';
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

const TOTAL_PAGES = 500;

const generatePage = createUniqueRandomGenerator(TOTAL_PAGES);

export const randomMovies = async (): Promise<Pagination<Show>> => {
  return http
    .get<TMDBPagination<Movie>>('/discover/movie', {
      params: {
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
        'vote_count.gte': 0,
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

export const externalIDs = async ({
  showId,
  showType = 'movie'
}: {
  showType: Show['type'];
  showId: Show['id'];
}): Promise<string> => {
  return http.get<ExternalIDS>(`/${showType}/${showId}/external_ids`).then(({ imdb_id }) => imdb_id);
};

export const credits = async ({
  showId,
  showType = 'movie'
}: {
  showId: Show['id'];
  showType?: Show['type'];
}): Promise<Array<Actor>> => {
  return http
    .get<{ cast: Array<unknown> }>(`/${showType}/${showId}/${showType === 'tv' ? 'aggregate_credits' : 'credits'}`)
    .then((data) => {
      if (showType === 'tv') {
        return data.cast.map((item) => {
          const actor = item as AggregatedActor;
          const [role] = actor.roles || [{}];
          return { ...actor, ...role } as unknown as Actor;
        });
      }
      return data.cast as Array<Actor>;
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

export const torrentFiles = (magnet: string): Promise<Video[]> => {
  return http
    .get<{ name: string; subtitles: Subtitles[] }[]>('/files', { params: { magnet } }, process.env.TRACKER_PROXY_BASE)
    .then((files) =>
      files.map((file) => {
        const base = `${process.env.TRACKER_PROXY_BASE}/stream?magnet=${encodeURIComponent(magnet)}}`;

        return {
          name: file.name,
          src: `${base}&filename=${encodeURIComponent(file.name)}`,
          subtitles: file.subtitles
        };
      })
    );
};

export const YTSTorrents = async ({
  query,
  sort,
  showType,
  showId
}: {
  query: string;
  sort: Sort;
  showId: Show['id'];
  showType: Show['type'];
}) => {
  try {
    const imdbID = await externalIDs({ showType, showId });
    const torrents = await yts.search({
      imdbID,
      query,
      sort
    });
    return torrents;
  } catch (error) {
    return [];
  }
};

export const TPBTorrents = async ({
  query,
  sort
}: {
  query: string;
  sort: Sort;
  showId: Show['id'];
  showType: Show['type'];
}) => {
  try {
    const torrents = await pirateBay.search({
      query,
      sort
    });
    return torrents;
  } catch (error) {
    return [];
  }
};
