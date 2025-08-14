import axios, { AxiosInstance } from 'axios';
import { load } from 'cheerio';
import torrentTitle from 'parse-torrent-title';

import { PIRATE_BAY_HOST } from '@/env';

import { Sort } from '../index';

export class PirateBay {
  private client: AxiosInstance;
  private host: string;
  private sort = {
    [Sort.size]: 5,
    [Sort.seeds]: 7
  };

  constructor() {
    this.host = PIRATE_BAY_HOST || 'https://thepiratebay10.info';

    this.client = axios.create({
      baseURL: this.host
    });
  }

  async search({
    query,
    page = 1,
    category = 200,
    sort = Sort.size
  }: {
    query: string;
    page?: number;
    category?: number;
    sort?: Sort;
  }): Promise<Torrent[]> {
    return this.client.post(`/search/${query}/${page}/${this.sort[sort]}/${category}`, null).then(({ data }) => {
      const $ = load(data);
      const table = $('#searchResult');
      const rows = table.find('tr:not(.header)');

      const titles = rows
        .map((_, row) => $(row).find('td:nth-child(2) a').text())
        .get()
        .filter(Boolean);
      const seeders = rows.map((_, row) => $(row).find('td:nth-child(6)').text()).get();

      const sizes = rows
        .map((_, row) => {
          const size = $(row).find('td:nth-child(5)').text();
          return size ? size.replace('&nbsp;', ' ').replace('Size ', '') : null;
        })
        .get()
        .filter(Boolean);

      const magnets = table
        .find('a[href^="magnet:"]')
        .map((_, link) => $(link).attr('href'))
        .get();

      return titles.map((originalTitle, index) => {
        const { title, resolution, source, codec, container, season, episode, year } = torrentTitle.parse(
          originalTitle || ''
        );

        return {
          year: year?.toString(),
          source,
          codec,
          container,
          originalTitle,
          title: `${title} ${season && episode ? `[S${season}:E${episode}]` : ''}`,
          id: title,
          size: sizes[index],
          seeders: parseInt(seeders[index] || '0', 10),
          quality: resolution,
          magnet: magnets[index] || '',
          hash: ''
        };
      });
    });
  }
}

const parser = new PirateBay();

export default parser;
