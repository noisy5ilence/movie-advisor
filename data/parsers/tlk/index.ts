import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { load } from 'cheerio';
import parseTorrent, { Instance } from 'parse-torrent';
import { Cookie, CookieJar, SerializedCookieJar } from 'tough-cookie';

import redis from '@/data/clients/redis';
import { TOLOKA_HOST, TOLOKA_PASSWORD, TOLOKA_USERNAME } from '@/env';

import { Sort, TRACKERS } from '../index';

import { parseTolokaTitle } from './title';

const COOKIE_JAR_KEY = 'toloka:cookie-jar';

type ShowType = 'movie' | 'tv';

// Section ids for the `f[]` search filter: the movie/TV sets keep releases of the
// other media type (and non-video sections) out of the results.
const MOVIE_SECTIONS = [16, 42, 55, 70, 96, 129];
const TV_SECTIONS = [32, 124, 173, 192];

const redisWarn = (message: string, error: unknown) =>
  console.warn(message, error instanceof Error ? error.message.split(', command was:')[0] : error);

export class Toloka {
  private client: AxiosInstance;
  private host: string;
  private sort = {
    [Sort.size]: 7,
    [Sort.seeds]: 10
  };

  private cookieJar = new CookieJar();

  private hydration?: Promise<void>;

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

  private hydrate() {
    this.hydration ??= (async () => {
      if (!redis) return;

      const serialized = await redis.get<SerializedCookieJar>(COOKIE_JAR_KEY);
      const cookies = serialized?.cookies || [];

      for (const data of cookies) {
        const cookie = Cookie.fromJSON(data);

        if (cookie) await this.cookieJar.store.putCookie(cookie);
      }

      console.info(`[tlk] restored ${cookies.length} session cookies from Redis`);
    })().catch((error) => {
      redisWarn('Failed to restore Toloka session from Redis:', error);
    });

    return this.hydration;
  }

  private async persist() {
    if (!redis) return;

    try {
      await redis.set(COOKIE_JAR_KEY, await this.cookieJar.serialize());

      console.info('[tlk] session persisted to Redis');
    } catch (error) {
      redisWarn('Failed to persist Toloka session to Redis:', error);
    }
  }

  private async auth() {
    console.info('[tlk] logging in to Toloka');

    const data = new FormData();

    data.append('username', TOLOKA_USERNAME as string);
    data.append('password', TOLOKA_PASSWORD as string);
    data.append('autologin', 'on');
    data.append('ssl', 'on');
    data.append('login', 'Вхід');

    await this.client.post('/login.php', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    await this.persist();
  }

  private buildSearchUrl(query: string, sections: number[], sort: Sort) {
    const params = new URLSearchParams();

    params.append('o', this.sort[sort].toString());
    params.append('nm', query);

    for (const section of sections) params.append('f[]', section.toString());

    return `/tracker.php?${params.toString()}`;
  }

  private async runSearch(url: string): Promise<Torrent[]> {
    const fetchPage = () => this.client.get(url);

    const parseTorrents = (data: string) => {
      const $ = load(data);
      const rows = $('.prow1, .prow2');

      return rows
        .map((_, row) => {
          const originalTitle = $(row).find('td:nth-child(3)').text();
          const size = $(row).find('td:nth-child(7)').text();
          const seeders = $(row).find('td:nth-child(10)').text();
          const download = $(row).find('td:nth-child(6) a').attr('href');

          const { year, source, codec, container, title, resolution, episodes } = parseTolokaTitle(originalTitle || '');

          return {
            year: year?.toString(),
            source,
            codec,
            container,
            originalTitle,
            title,
            episodes,
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

  async search({ query, sort = Sort.size, type }: { query: string; sort?: Sort; type?: ShowType }): Promise<Torrent[]> {
    await this.hydrate();

    const sections = type === 'tv' ? TV_SECTIONS : type === 'movie' ? MOVIE_SECTIONS : [];

    const search = (searchQuery: string) => this.runSearch(this.buildSearchUrl(searchQuery, sections, sort));

    const torrents = await search(query);

    if (torrents.length) return torrents;

    // The query is scoped by the show's year to disambiguate sequels, but the TMDB
    // release year can differ from the year in release names, so fall back to the bare title.
    const fallback = query.replace(/\s\d{4}$/, '');

    return fallback === query ? torrents : search(fallback);
  }

  async magnet(url: string) {
    await this.hydrate();

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

    const trackers = TRACKERS.map((tracker) => `&tr=${encodeURIComponent(tracker)}`).join('');

    return `magnet:?xt=urn:btih:${torrent.infoHash}&dn=${encodeURIComponent(torrent.name?.toString() || '')}${trackers}`;
  }
}

const parser = new Toloka();

export default parser;
