import { isServer } from '@tanstack/react-query';

import { MOVIE_DB_API_URL, MOVIE_DB_TOKEN } from '@/env';
import trimTmdb from '@/lib/tmdbTrim';

import Http from './Http';

type Search = Record<string, string | number | boolean | null | undefined>;

const http = isServer ? new Http(MOVIE_DB_API_URL, `Bearer ${MOVIE_DB_TOKEN}`) : new Http('/api/tmdb');

// The browser goes through the /api/tmdb proxy, which trims responses; on the server we hit the
// API directly, so apply the same trim to keep both paths returning identical data.
const movieAdvisor = {
  get: <T>(url: string, { params, preventCache }: { params?: Search; preventCache?: boolean } = {}) =>
    http.get<T>(url, { params, preventCache }).then((data) => trimTmdb(url, data) as T),
  post: <T, B = unknown>(
    url: string,
    { params, preventCache }: { params?: Search; preventCache?: boolean } = {},
    body?: B
  ) => http.post<T, B>(url, { params, preventCache }, body)
};

export default movieAdvisor;
