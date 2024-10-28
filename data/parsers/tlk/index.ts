import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { load } from 'cheerio';
import parseTorrent, { Instance } from 'parse-torrent';
import torrentTitle from 'parse-torrent-title';
import { CookieJar } from 'tough-cookie';

import { TOLOKA_HOST, TOLOKA_PASSWORD, TOLOKA_USERNAME } from '@/env';

import { Sort } from '../index';

export class Toloka {
  private client: AxiosInstance;
  private host: string;
  private sort = {
    [Sort.size]: 7,
    [Sort.seeds]: 10
  };

  private cookieJar = new CookieJar();

  private magnets: Record<string, string> = {};

  constructor() {
    this.host = TOLOKA_HOST || 'https://toloka.to';

    this.client = wrapper(
      axios.create({
        jar: this.cookieJar,
        baseURL: this.host,
        withCredentials: true
      })
    );
  }

  private async isAuthorized(data: string) {
    return !load(data)('[href="/login.php"]').length;
  }

  private async auth() {
    const data = new FormData();

    data.append('username', TOLOKA_USERNAME as string);
    data.append('password', TOLOKA_PASSWORD as string);
    data.append('autologin', 'on');
    data.append('ssl', 'on');
    data.append('login', 'Вхід');

    await this.client.post('/login.php', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async search({ query, sort = Sort.size }: { query: string; sort?: Sort }): Promise<Torrent[]> {
    const fetchPage = () => this.client.get(`/tracker.php?o=${this.sort[sort]}&nm=${query}`);

    const parseTorrents = (data: string) => {
      const $ = load(data);
      const rows = $('.prow1, .prow2');

      return rows
        .map((_, row) => {
          const originalTitle = $(row).find('td:nth-child(3)').text();
          const size = $(row).find('td:nth-child(7)').text();
          const seeders = $(row).find('td:nth-child(10)').text();
          const download = $(row).find('td:nth-child(6) a').attr('href');

          const { year, source, codec, container, title, season, episode, resolution } = torrentTitle.parse(
            originalTitle || ''
          );

          return {
            year: year?.toString(),
            source,
            codec,
            container,
            originalTitle,
            title: `${title}${season && episode ? ` [S${season}:E${episode}]` : ''}`,
            id: originalTitle || '',
            size,
            seeders: parseInt(seeders || '0'),
            quality: resolution,
            magnet: '',
            download
          };
        })
        .get();
    };

    let page = await fetchPage();

    if (await this.isAuthorized(page.data)) return parseTorrents(page.data);

    await this.auth();

    page = await fetchPage();

    return parseTorrents(page.data);
  }

  async magnet(url: string) {
    if (this.magnets[url]) return this.magnets[url];

    const fetchTorrent = async () => {
      const { data: buffer } = await this.client.get(`/${url}`, {
        responseType: 'arraybuffer'
      });

      return parseTorrent(buffer);
    };

    let torrent: Instance;

    try {
      torrent = (await fetchTorrent()) as Instance;
    } catch (_) {
      await this.auth();

      torrent = (await fetchTorrent()) as Instance;
    }

    const magnet = `magnet:?xt=urn:btih:${torrent.infoHash}&dn=${encodeURIComponent(torrent.name?.toString() || '')}`;

    this.magnets[url] = magnet;

    return this.magnets[url];
  }
}

const parser = new Toloka();

export default parser;
