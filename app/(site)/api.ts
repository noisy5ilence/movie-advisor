import { Filters } from '@/app/(site)/useFilters';
import client from '@/network';

const API = {
  genres(): Promise<IDName[]> {
    return client.get('/genres');
  },
  credits({ movieId }: { movieId: Movie['id'] }): Promise<Actor[]> {
    return client.get('/credits', {
      params: {
        movieId
      }
    });
  },
  trailers({ movieId }: { movieId: number }): Promise<Trailer[]> {
    return client.get('/trailer', {
      params: {
        movieId
      }
    });
  },
  random({ filters }: { filters: Partial<Filters> }): Promise<Movie[]> {
    return client.get('/random', {
      params: {
        with_genres: filters.genres?.join('|'),
        'vote_average.gte': filters.score?.[0],
        'vote_average.lte': filters.score?.[1],
        'release_date.gte': filters.year?.[0],
        'release_date.lte': filters.year?.[1]
      }
    });
  }
};

export default API;
