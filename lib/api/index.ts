'use server';

import server from '@/network/server';

import filterUnknownMovies from '../filterUnknownMovies';

import pirateBay from './parsers/pirate-bay';

export const search = async ({
  query,
  page,
  type = 'movie'
}: {
  query: string;
  page: number;
  type: ShowType;
}): Promise<MovieDBResponse> => {
  return server.get(`/search/${type}`, {
    params: {
      query,
      page
    }
  });
};

export const randomMovies = async ({ filters }: { filters: Partial<Filters> }): Promise<Movie[]> => {
  return server
    .get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        page: Math.floor(Math.random() * 500) + 1,
        with_genres: filters.genres?.join('|'),
        'vote_average.gte': filters.score?.[0],
        'vote_average.lte': filters.score?.[1],
        'release_date.gte': filters.year?.[0],
        'release_date.lte': filters.year?.[1]
      }
    })
    .then((data: unknown) => filterUnknownMovies((data as MovieDBResponse).results));
};

export const popularMovies = async ({ page }: { page?: string } = {}): Promise<MovieDBResponse> => {
  return server.get('/discover/movie', {
    params: {
      page,
      sort_by: 'popularity.desc',
      'vote_count.gte': 0,
      'vote_average.lte': 10,
      'vote_average.gte': 0,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400
    }
  });
};

export const trendingMovies = async ({ page }: { page?: string } = {}): Promise<MovieDBResponse> => {
  return server.get('/trending/movie/day', {
    params: {
      page
    }
  });
};

export const topMovies = async ({
  page,
  starring
}: { page?: string; starring?: string } = {}): Promise<MovieDBResponse> => {
  return server.get('/discover/movie', {
    params: {
      page,
      with_cast: starring,
      with_people: starring,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 300,
      'vote_average.lte': 10,
      'vote_average.gte': 0
    }
  });
};

export const similarMovies = async ({
  page,
  movieId,
  type = 'movie'
}: {
  page?: string;
  movieId?: string;
  type?: ShowType;
}): Promise<MovieDBResponse> => {
  return server.get(`/${type}/${movieId}/recommendations`, {
    params: {
      page
    }
  });
};

export const genres = async (): Promise<IDName[]> => {
  return server.get('/genre/movie/list').then((response) => (response as unknown as { genres: IDName[] }).genres);
};

export const credits = async ({
  movieId,
  type = 'movie'
}: {
  movieId: number;
  type?: ShowType;
}): Promise<Array<Actor>> => {
  'use server';

  return server.get(`/${type}/${movieId}/${type === 'tv' ? 'aggregate_credits' : 'credits'}`).then((response) => {
    const data = (response as unknown as { cast: Array<unknown> }).cast;
    if (type === 'tv') {
      return data.map((item) => {
        const actor = item as AggregatedActor;
        const [role] = actor.roles || [{}];
        return { ...actor, ...role } as unknown as Actor;
      });
    }
    return data as Array<Actor>;
  });
};

export const torrents = async ({ query, order, seeders }: { query: string; seeders?: number; order: number }) => {
  'use server';

  try {
    const torrents = await pirateBay.search({
      query,
      order: order || seeders
    });
    return torrents;
  } catch (error) {
    return [];
  }
};

export const trailers = async ({ movieId, type }: { movieId: number; type?: ShowType }): Promise<Trailer[]> => {
  'use server';

  return server
    .get(`/${type}/${movieId}/videos`, {
      params: {
        language: 'en-US'
      }
    })
    .then((response) => (response as unknown as { id: number; results: Trailer[] }).results);
};
