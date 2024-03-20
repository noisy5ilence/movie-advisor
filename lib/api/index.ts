'use server';

import server from '@/network/server';

import pirateBay from './parsers/pirate-bay';

export const search = async ({ query, page }: { query: string; page: number }): Promise<MovieDBResponse> => {
  return server.get('/search/movie', {
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
    .then((data: unknown) => (data as MovieDBResponse).results);
};

export const popularMovies = async ({ page }: { page?: string }): Promise<MovieDBResponse> => {
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

export const topMovies = async ({ page, starring }: { page?: string; starring?: string }): Promise<MovieDBResponse> => {
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
  movieId
}: {
  page?: string;
  movieId?: string;
}): Promise<MovieDBResponse> => {
  return server.get(`/movie/${movieId}/recommendations`, {
    params: {
      page
    }
  });
};

export const genres = async (): Promise<IDName[]> => {
  return server.get('/genre/movie/list').then((response) => (response as unknown as { genres: IDName[] }).genres);
};

export const credits = async ({ movieId }: { movieId: number }): Promise<Array<Actor>> => {
  'use server';

  return server
    .get(`/movie/${movieId}/credits`)
    .then((response) => (response as unknown as { cast: Array<Actor> }).cast);
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

export const trailers = async ({ movieId }: { movieId: number }): Promise<Trailer[]> => {
  'use server';

  return server
    .get(`/movie/${movieId}/videos`, {
      params: {
        language: 'en-US'
      }
    })
    .then((response) => (response as unknown as { id: number; results: Trailer[] }).results);
};
