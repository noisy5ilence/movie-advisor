import axios, { AxiosInstance } from 'axios';

import { YTS_HOST } from '@/env';

import { Sort, TRACKERS } from '../index';

import { YTSResponse } from './models';

export class YTS {
  private client: AxiosInstance;
  private host: string;

  constructor() {
    this.host = YTS_HOST || 'https://yts.lt/api/v2/list_movies.json';

    this.client = axios.create({
      baseURL: this.host
    });
  }

  async search({
    query,
    page = 1,
    sort = Sort.size,
    imdbID
  }: {
    query: string;
    imdbID: string;
    page?: number;
    sort?: Sort;
  }): Promise<Torrent[]> {
    return this.client
      .get<YTSResponse>('', {
        params: {
          page,
          query_term: query,
          sort_by: sort
        }
      })
      .then(({ data }) => {
        const movie = data?.data?.movies?.find((movie) => movie.imdb_code === imdbID);

        return (
          movie?.torrents.map((torrent) => {
            return {
              id: movie.id?.toString(),
              title: movie.title_english,
              seeders: torrent.seeds,
              size: torrent.size,
              quality: torrent.quality,
              source: torrent.type,
              year: movie.year?.toString(),
              magnet: `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(query)}&tr=${TRACKERS.join('&tr=')}`,
              hash: torrent.hash,
              codec: torrent.video_codec
            };
          }) || []
        );
      });
  }
}

const yts = new YTS();

export default yts;
