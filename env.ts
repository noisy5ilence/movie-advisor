export const TITLE = process.env.NEXT_PUBLIC_TITLE || 'Movie Advisor';

const BASE =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL;
export const SITE_URL = `${BASE?.startsWith('http') ? BASE : `https://${BASE}`}`;

export const MOVIE_DB_TOKEN = process.env.MOVIE_DB_TOKEN;
export const MOVIE_DB_API_URL = process.env.MOVIE_DB_API_URL || 'https://api.themoviedb.org/3';

export const STREAM_URL = process.env.NEXT_PUBLIC_TORRENT_PROXY || '';
export const PRELOAD_CACHE_LIMIT = +(process.env.NEXT_PUBLIC_PRELOAD_CACHE_LIMIT || 32);

export const TOLOKA_HOST = process.env.TOLOKA_HOST;
export const TOLOKA_USERNAME = process.env.TOLOKA_USERNAME;
export const TOLOKA_PASSWORD = process.env.TOLOKA_PASSWORD;

export const PIRATE_BAY_HOST = process.env.PIRATE_BAY_HOST;
export const YTS_HOST = process.env.YTS_HOST;

export const OPENSUBTITLES_API_URL = process.env.OPENSUBTITLES_API_URL || 'https://api.opensubtitles.com/api/v1';
export const OPENSUBTITLES_API_KEY = process.env.OPENSUBTITLES_API_KEY;
export const OPENSUBTITLES_USERNAME = process.env.OPENSUBTITLES_USERNAME;
export const OPENSUBTITLES_PASSWORD = process.env.OPENSUBTITLES_PASSWORD;
export const SUBTITLE_LANGUAGES = process.env.SUBTITLE_LANGUAGES || 'en,uk';

export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
