import client from '@/network';

const API = {
  search: {
    byTitle({ query, page }: { query: string; page: number }): Promise<MovieDBResponse> {
      return client.get('/search', {
        params: {
          query,
          page
        }
      });
    }
  }
};

export default API;
