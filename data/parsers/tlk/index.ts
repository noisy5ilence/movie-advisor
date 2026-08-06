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
const MAGNET_KEY_PREFIX = 'toloka:magnet:';

// UpstashError messages embed the full command, including cookie values — never log them
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

  async search({ query, sort = Sort.size }: { query: string; sort?: Sort }): Promise<Torrent[]> {
    await this.hydrate();

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

  async magnet(url: string) {
    if (this.magnets[url]) return this.magnets[url];

    await this.hydrate();

    // an infohash never changes for a given torrent, so a cached magnet is valid forever
    // and saves a .torrent download from Toloka on every cold start
    try {
      const cached = await redis?.get<string>(`${MAGNET_KEY_PREFIX}${url}`);

      if (cached) {
        this.magnets[url] = cached;

        return cached;
      }
    } catch (error) {
      redisWarn('Failed to read Toloka magnet from Redis:', error);
    }

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

    console.info(`[tlk] downloaded .torrent for ${url}`);

    // the .torrent's own announce URLs embed the account passkey — never expose them in a magnet;
    // public trackers help discover cross-seeded peers, the rest is covered by DHT
    const trackers = TRACKERS.map((tracker) => `&tr=${encodeURIComponent(tracker)}`).join('');
    const magnet = `magnet:?xt=urn:btih:${torrent.infoHash}&dn=${encodeURIComponent(torrent.name?.toString() || '')}${trackers}`;

    this.magnets[url] = magnet;

    try {
      await redis?.set(`${MAGNET_KEY_PREFIX}${url}`, magnet);
    } catch (error) {
      redisWarn('Failed to persist Toloka magnet to Redis:', error);
    }

    return magnet;
  }
}

const parser = new Toloka();

export default parser;
