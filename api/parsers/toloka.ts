import axios, { AxiosInstance } from 'axios';
import { parse } from 'node-html-parser';
import parseTorrent from 'parse-torrent';
import torrentTitle from 'parse-torrent-title';

import { Sort } from './index';

export class Toloka {
  private client: AxiosInstance;
  private sort = {
    [Sort.size]: 7,
    [Sort.seeds]: 10
  };

  private magnets: Record<string, string> = {};

  constructor(private host: string = process.env.TOLOKA_HOST || 'https://toloka.to') {
    this.host = host;
    this.client = axios.create({
      baseURL: this.host,
      headers: { Cookie: 'toloka_sid=0504c23f6b4fc00d39530cfa78f8d767; toloka_ssl=1' }
    });
  }

  async search({ query, sort = Sort.size }: { query: string; sort?: Sort }): Promise<Torrent[]> {
    return this.client.get(`/tracker.php?o=${this.sort[sort]}&nm=${query}`).then(({ data }) => {
      const html = parse(data);
      const rows = html?.querySelectorAll('.prow1, .prow2');

      return rows?.map((row) => {
        const originalTitle = row.querySelector('td:nth-child(3)')?.innerText;
        const size = row.querySelector('td:nth-child(7)')?.innerText;
        const seeders = row.querySelector('td:nth-child(10)')?.innerText;
        const download = row.querySelector('td:nth-child(6) a')?.getAttribute('href');

        const { year, source, codec, container, title, season, episode, resolution } = torrentTitle.parse(
          originalTitle || ''
        );

        return {
          year,
          source,
          codec,
          container,
          originalTitle,
          title: `${title}${season && episode ? ` [S${season}:E${episode}]` : ''}`,
          id: originalTitle,
          size,
          seeders: parseInt(seeders || '0'),
          quality: resolution,
          magnet: '',
          download
        };
      }) as Torrent[];
    });
  }

  async magnet(url: string): Promise<string> {
    if (this.magnets[url]) return this.magnets[url];
    const { data } = await this.client.get(`/${url}`, {
      responseType: 'arraybuffer'
    });

    const torrent = await parseTorrent(data);

    const magnet = `magnet:?xt=urn:btih:${torrent.infoHash}&dn=${encodeURIComponent(
      torrent.name as string
    )}&tr=${torrent.announce?.join('&tr=')}`;

    this.magnets[url] = magnet;

    return magnet;
  }
}

const parser = new Toloka();

export default parser;
