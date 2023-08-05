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
    },
    byDescription({ description }: { description: string }): Promise<Array<Movie>> {
      return client.get('/search/description', {
        params: {
          description
        }
      });
    }
  }
};

export default API;
