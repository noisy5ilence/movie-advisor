import { OPENSUBTITLES_API_KEY, OPENSUBTITLES_API_URL, OPENSUBTITLES_PASSWORD, OPENSUBTITLES_USERNAME } from '@/env';

import redis from './redis';

const USER_AGENT = 'movie-advisor v1.0';

const TOKEN_KEY = 'opensubtitles:token';
const TOKEN_TTL = 60 * 60 * 20;

const PER_LANGUAGE = 3;

interface OSFile {
  file_id: number;
  file_name: string;
}

interface OSSubtitle {
  attributes: {
    language: string | null;
    release: string;
    download_count: number;
    hearing_impaired: boolean;
    machine_translated: boolean;
    files: OSFile[];
  };
}

interface SearchParams {
  type: Show['type'];
  imdbId?: string;
  tmdbId?: string;
  season?: number;
  episode?: number;
  languages: string;
}

interface Token {
  token: string;
  expires: number;
}

const headers = () => ({
  'Api-Key': OPENSUBTITLES_API_KEY ?? '',
  'User-Agent': USER_AGENT,
  'Content-Type': 'application/json',
  Accept: 'application/json'
});

let memoryToken: Token | null = null;

const login = async (): Promise<string | null> => {
  if (!OPENSUBTITLES_USERNAME || !OPENSUBTITLES_PASSWORD) return null;

  if (memoryToken && memoryToken.expires > Date.now()) return memoryToken.token;

  const cached = await redis?.get<Token>(TOKEN_KEY).catch(() => null);
  if (cached && cached.expires > Date.now()) {
    memoryToken = cached;
    return cached.token;
  }

  const response = await fetch(`${OPENSUBTITLES_API_URL}/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ username: OPENSUBTITLES_USERNAME, password: OPENSUBTITLES_PASSWORD }),
    cache: 'no-store'
  });

  if (!response.ok) return null;

  const { token }: { token: string } = await response.json();

  memoryToken = { token, expires: Date.now() + TOKEN_TTL * 1000 };
  await redis?.set(TOKEN_KEY, memoryToken, { ex: TOKEN_TTL }).catch(() => null);

  return token;
};

const languageName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
};

const numericId = (value?: string) => {
  const digits = value?.replace(/\D/g, '');
  return digits ? String(Number(digits)) : undefined;
};

export const searchSubtitles = async ({
  type,
  imdbId,
  tmdbId,
  season,
  episode,
  languages
}: SearchParams): Promise<Source[]> => {
  if (!OPENSUBTITLES_API_KEY) return [];

  const params = new URLSearchParams({ languages: languages.toLowerCase() });

  const imdb = numericId(imdbId);

  if (type === 'tv') {
    if (imdb) params.set('parent_imdb_id', imdb);
    else if (tmdbId) params.set('parent_tmdb_id', tmdbId);
    if (season != null) params.set('season_number', season.toString());
    if (episode != null) params.set('episode_number', episode.toString());
  } else {
    if (imdb) params.set('imdb_id', imdb);
    else if (tmdbId) params.set('tmdb_id', tmdbId);
  }

  params.sort();

  const response = await fetch(`${OPENSUBTITLES_API_URL}/subtitles?${params}`, {
    headers: headers(),
    next: { revalidate: 86400 }
  });

  if (!response.ok) {
    throw new Error(`OpenSubtitles search failed: ${response.status} ${await response.text().catch(() => '')}`);
  }

  const { data }: { data: OSSubtitle[] } = await response.json();

  const requested = languages.toLowerCase().split(',');

  const grouped = data.reduce<Record<string, OSSubtitle['attributes'][]>>((grouped, { attributes }) => {
    const language = attributes.language?.toLowerCase();

    if (!language || attributes.machine_translated || !attributes.files.length) return grouped;

    (grouped[language] ??= []).push(attributes);

    return grouped;
  }, {});

  const sources = requested
    .filter((language) => grouped[language])
    .flatMap((language) =>
      grouped[language]
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, PER_LANGUAGE)
        .map((attributes) => {
          const [file] = attributes.files;
          const release = (attributes.release || file.file_name).slice(0, 50);

          return {
            name: `${languageName(language)} · ${release}${attributes.hearing_impaired ? ' · HI' : ''}`,
            src: `/api/subtitles/${file.file_id}`,
            type: 'vtt',
            lang: language
          };
        })
    );

  return sources.filter(({ name }, index) => sources.findIndex((source) => source.name === name) === index);
};

export const downloadSubtitle = async (fileId: number): Promise<string> => {
  if (!OPENSUBTITLES_API_KEY) throw new Error('OpenSubtitles API key is not configured');

  const token = await login();

  const response = await fetch(`${OPENSUBTITLES_API_URL}/download`, {
    method: 'POST',
    headers: { ...headers(), ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify({ file_id: fileId, sub_format: 'webvtt' }),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(
      `OpenSubtitles download request failed: ${response.status} ${await response.text().catch(() => '')}`
    );
  }

  const { link }: { link: string } = await response.json();

  const file = await fetch(link, { cache: 'no-store' });

  if (!file.ok) throw new Error(`OpenSubtitles file fetch failed: ${file.status}`);

  return file.text();
};
