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
  person({ id }: { id: string }): Promise<Person> {
    return client.get('/person', {
      params: {
        id
      }
    });
  }
};

export default API;
