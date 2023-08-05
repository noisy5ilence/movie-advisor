import client from '@/network';

const API = {
  top({ page }: { page: string }): Promise<MovieDBResponse> {
    return client.get('/discover', {
      params: {
        page,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 300,
        'vote_average.lte': 10,
        'vote_average.gte': 0
      }
    });
  }
};

export default API;
