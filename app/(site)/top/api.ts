import client from '@/network';

const API = {
  top({ page, starring }: { page: string; starring: string | null }): Promise<MovieDBResponse> {
    return client.get('/discover', {
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
  },
  similar({ page, movieId }: { page: string; movieId: string }): Promise<MovieDBResponse> {
    return client.get('/discover/similar', {
      params: {
        page,
        movieId
      }
    });
  }
};

export default API;
