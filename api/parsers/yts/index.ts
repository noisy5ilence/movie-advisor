import axios, { AxiosInstance } from 'axios';

import { Sort } from '../index';

import { YTSResponse } from './models';

export class YTS {
  private client: AxiosInstance;
  private host: string;

  constructor() {
    this.host = process.env.YTS_HOST || 'https://yts.mx/api/v2/list_movies.json';

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
            const trackers = [
              'udp://open.demonii.com:1337/announce',
              'udp://tracker.openbittorrent.com:80',
              'udp://tracker.coppersurfer.tk:6969',
              'udp://glotorrents.pw:6969/announce',
              'udp://tracker.opentrackr.org:1337/announce',
              'udp://torrent.gresille.org:80/announce',
              'udp://p4p.arenabg.com:1337',
              'udp://tracker.leechers-paradise.org:6969'
            ];

            return {
              id: movie.id?.toString(),
              title: movie.title_english,
              seeders: torrent.seeds,
              size: torrent.size,
              quality: torrent.quality,
              source: torrent.type,
              year: movie.year?.toString(),
              magnet: `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(query)}&tr=${trackers.join('&tr=')}`
            };
          }) || []
        );
      });
  }
}

const yts = new YTS();

export default yts;
